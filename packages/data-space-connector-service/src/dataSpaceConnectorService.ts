// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import {
	BackgroundTaskConnectorFactory,
	TaskStatus,
	type IBackgroundTask,
	type IBackgroundTaskConnector
} from "@twin.org/background-task-models";
import {
	Is,
	type IValidationFailure,
	NotFoundError,
	StringHelper,
	Validation,
	Converter,
	ConflictError,
	type IError
} from "@twin.org/core";
import { Blake2b } from "@twin.org/crypto";
import {
	JsonLdHelper,
	JsonLdProcessor,
	type IJsonLdDocument,
	JsonLdDataTypes,
	type IJsonLdNodeObject
} from "@twin.org/data-json-ld";
import {
	type IActivity,
	type IDataSpaceConnector,
	type IActivityLogEntry,
	type ISubscription,
	type ISubscriptionEntry,
	type IDataSpaceQuery,
	DataSpaceConnectorDataTypes,
	ActivityProcessingStatus,
	type IActivityObjectTargetTriple,
	type IDataSpaceConnectorAppDescriptor,
	type IActivityLogDetails,
	type ITaskApp,
	type IExecutionPayload
} from "@twin.org/data-space-connector-models";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { LoggingConnectorFactory, type ILoggingConnector } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { AppRegistry } from "./appRegistry";
import type { ActivityLogDetails } from "./entities/activityLogDetails";
import type { ActivityTask } from "./entities/activityTask";
import type { SubscriptionEntry } from "./entities/subscriptionEntry";
import type { IDataSpaceConnectorServiceConstructorOptions } from "./models/IDataSpaceConnectorServiceConstructorOptions";

/**
 * Data Space Connector Service.
 */
export class DataSpaceConnectorService implements IDataSpaceConnector {
	/**
	 * DS Connector Task Type.
	 * @internal
	 */
	private static readonly _DS_CONNECTOR_TASK_TYPE: string = "dataSpaceConnectorTask";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<DataSpaceConnectorService>();

	/**
	 * Logging service.
	 * @internal
	 */
	private readonly _loggingService?: ILoggingConnector;

	/**
	 * Storage service for subscriptions.
	 * @internal
	 */
	private readonly _entityStorageSubscriptions: IEntityStorageConnector<SubscriptionEntry>;

	/**
	 * Storage service for activity logging.
	 * @internal
	 */
	private readonly _entityStorageActivityLogs: IEntityStorageConnector<ActivityLogDetails>;

	/**
	 * Storage service for activity tasks.
	 * @internal
	 */
	private readonly _entityStorageActivityTasks: IEntityStorageConnector<ActivityTask>;

	/**
	 * Handler registry of Data Space Connector Apps.
	 * @internal
	 */
	private readonly _appRegistry: AppRegistry;

	/**
	 * Background Task Connector
	 * @internal
	 */
	private readonly _backgroundTaskConnector: IBackgroundTaskConnector;

	/**
	 * Create a new instance of FederatedCatalogue service.
	 * @param options The options for the connector.
	 */
	constructor(options: IDataSpaceConnectorServiceConstructorOptions) {
		this._loggingService = LoggingConnectorFactory.getIfExists(
			options?.loggingConnectorType ?? "logging"
		);

		this._entityStorageActivityLogs = EntityStorageConnectorFactory.get<
			IEntityStorageConnector<ActivityLogDetails>
		>(options.activityLogEntityStorageType ?? StringHelper.kebabCase(nameof<ActivityLogDetails>()));

		this._entityStorageActivityTasks = EntityStorageConnectorFactory.get<
			IEntityStorageConnector<ActivityTask>
		>(options.activityTaskEntityStorageType ?? StringHelper.kebabCase(nameof<ActivityTask>()));

		this._entityStorageSubscriptions = EntityStorageConnectorFactory.get<
			IEntityStorageConnector<SubscriptionEntry>
		>(options.subscriptionEntityStorageType ?? StringHelper.kebabCase(nameof<SubscriptionEntry>()));

		this._backgroundTaskConnector = BackgroundTaskConnectorFactory.get(
			options?.backgroundTaskConnectorType ?? "background-task-4-data-space"
		);
		this._appRegistry = new AppRegistry();

		JsonLdDataTypes.registerTypes();
		DataSpaceConnectorDataTypes.registerTypes();
	}

	/**
	 * Notify an Activity.
	 * @param activity The Activity notified.
	 * @returns The Activity's Log Entry identifier.
	 */
	public async notifyActivity(activity: IActivity): Promise<string> {
		// Validate that the Activity notified is encoded using the representation format expected by the Connector
		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(activity, validationFailures, { failOnMissingType: true });
		Validation.asValidationError(this.CLASS_NAME, nameof(activity), validationFailures);

		// Avoid using terms not defined in any Ld Context
		const compactedObj = await JsonLdProcessor.compact(activity, activity["@context"]);

		// Calculate Activity Log Entry Id
		const canonical = await JsonLdProcessor.canonize(compactedObj);
		const canonicalBytes = new TextEncoder().encode(canonical);
		const activityLogId = Converter.bytesToHex(Blake2b.sum256(canonicalBytes));
		const activityLogEntryId = `urn:x-activity-log:${activityLogId}`;

		// Avoid duplicates
		const entryExists = !Is.undefined(
			await this._entityStorageActivityLogs.get(activityLogEntryId)
		);
		if (entryExists) {
			throw new ConflictError(
				this.CLASS_NAME,
				"dataSpaceConnector.activityAlreadyNotified",
				activityLogEntryId
			);
		}

		// First of all Activity Log Entry is created
		const logEntry: IActivityLogDetails = {
			id: activityLogEntryId,
			generator:
				(activity.generator as string) ?? ((activity.actor as IJsonLdNodeObject).id as string),
			status: ActivityProcessingStatus.Pending,
			dateCreated: new Date().toISOString(),
			dateUpdated: new Date().toISOString()
		};
		await this._entityStorageActivityLogs.set(logEntry);

		const triples = await this.calculateTriple(compactedObj);

		const tasksScheduled: ITaskApp[] = [];
		for (const triple of triples) {
			const dataSpaceConnectorApps = this._appRegistry.getAppForActivityObjectTargetTriple(triple);

			for (const dataSpaceConnectorApp of dataSpaceConnectorApps) {
				const payload: IExecutionPayload = {
					activityLogEntryId,
					activity: compactedObj,
					executorApp: dataSpaceConnectorApp.id
				};
				const taskId = await this._backgroundTaskConnector.create<IExecutionPayload>(
					dataSpaceConnectorApp.id,
					payload,
					{
						retainFor: -1
					}
				);

				tasksScheduled.push({
					taskId,
					dataSpaceConnectorAppId: dataSpaceConnectorApp.id
				});

				await this._loggingService?.log({
					level: "info",
					source: this.CLASS_NAME,
					message: "dataSpaceConnector.scheduledTask",
					data: {
						taskId,
						dataSpaceConnectorAppId: dataSpaceConnectorApp.id
					}
				});
			}
		}

		if (tasksScheduled.length > 0) {
			// This might happen after the tasks have been scheduled and actually finalized so there can be temporary
			// inconsistencies in the data that will be eventually solved
			await this._entityStorageActivityTasks.set({
				activityLogEntryId,
				associatedTasks: tasksScheduled
			});
		} else {
			logEntry.status = ActivityProcessingStatus.Completed;
			await this._entityStorageActivityLogs.set(logEntry);
		}

		return activityLogEntryId;
	}

	/**
	 * Returns the activity processing details of an activity.
	 * @param logEntryId The Id of the Activity Log Entry (a URI).
	 * @returns the Activity Log Entry with the processing details.
	 * @throws NotFoundError if activity log entry is not known.
	 */
	public async getActivityLogEntry(logEntryId: string): Promise<IActivityLogEntry> {
		const result = await this._entityStorageActivityLogs.get(logEntryId);
		if (Is.undefined(result)) {
			throw new NotFoundError(
				this.CLASS_NAME,
				"dataSpaceConnector.activityLogEntryNotFound",
				logEntryId
			);
		}

		let associatedTasks: IActivityLogEntry["associatedTasks"];
		let finalizedTasks: IActivityLogEntry["finalizedTasks"];
		let inErrorTasks: IActivityLogEntry["inErrorTasks"];

		// Now query the associated tasks
		const activityTasks = await this._entityStorageActivityTasks.get(logEntryId);

		// If activity tasks is undefined it might because
		// there are no tasks or because the corresponding store has not been persisted yet
		if (!Is.undefined(activityTasks)) {
			associatedTasks = [];
			finalizedTasks = [];
			inErrorTasks = [];

			for (const entity of activityTasks.associatedTasks) {
				associatedTasks.push(entity as ITaskApp);

				const taskDetails = await this._backgroundTaskConnector.get<IExecutionPayload, unknown>(
					entity.taskId
				);

				if (taskDetails?.status === TaskStatus.Success) {
					finalizedTasks.push({
						...(entity as ITaskApp),
						result: JSON.stringify(taskDetails?.result)
					});
				}

				if (taskDetails?.status === TaskStatus.Failed) {
					inErrorTasks.push({
						...(entity as ITaskApp),
						error: taskDetails.error as IError
					});
				}
			}
		}

		return { ...result, associatedTasks, finalizedTasks, inErrorTasks };
	}

	/**
	 * Subscribe to the Data Space Connector.
	 * @param subscription The subscription
	 * @returns void
	 */
	public async subscribe(subscription: ISubscription): Promise<string> {
		return "";
	}

	/**
	 * Returns a subscription entry.
	 * @param entryId The entry Id (a URI)
	 * @returns The subscription entry
	 */
	public async getSubscriptionEntry(entryId: string): Promise<ISubscriptionEntry> {
		const result = await this._entityStorageSubscriptions.get(entryId);
		if (Is.undefined(result)) {
			throw new NotFoundError(
				this.CLASS_NAME,
				"dataSpaceConnector.subscriptionEntryNotFound",
				entryId
			);
		}

		return result;
	}

	/**
	 * Gets data associated with a Service Offering.
	 * @param serviceOfferingId The Service Offering Id as registered on the Federated Catalogue.
	 * @param dataResourceId The Data Resource as registered on the Federated Catalogue.
	 * @param query The Data Space Connector query.
	 * @returns a JSON-LD document with the data
	 */
	public async getData(
		serviceOfferingId: string,
		dataResourceId?: string,
		query?: IDataSpaceQuery
	): Promise<IJsonLdDocument> {
		return {
			"@context": "http://example.org"
		};
	}

	/**
	 * Registers a Data Space Connector App.
	 * @param app The App to be registered.
	 */
	public registerDataSpaceConnectorApp(app: IDataSpaceConnectorAppDescriptor): void {
		const activityObjectTargetTriples = app.handledTypes.activityObjectTargetTriples;

		if (Is.arrayValue(activityObjectTargetTriples)) {
			for (const triple of activityObjectTargetTriples) {
				this._appRegistry.setAppForActivityObjectTargetTriple(triple, app);
			}
		}

		this._backgroundTaskConnector.registerHandler<IExecutionPayload, unknown>(
			app.id,
			app.moduleName,
			"executeTask",
			async task => {
				await this.finaliseTask(task);
			}
		);
	}

	/**
	 * Process activity task finalization.
	 * @param proofEntity The proof entity to process.
	 * @internal
	 */
	private async finaliseTask(task: IBackgroundTask<IExecutionPayload, unknown>): Promise<void> {
		const payload = task.payload;

		if (Is.undefined(payload)) {
			return;
		}

		const activityLogEntry = await this._entityStorageActivityLogs.get(payload.activityLogEntryId);
		if (Is.undefined(activityLogEntry)) {
			this._loggingService?.log({
				level: "error",
				source: this.CLASS_NAME,
				message: "dataSpaceConnector.unknownActivityLogEntryId",
				data: {
					activityLogEntryId: payload.activityLogEntryId
				}
			});
			return;
		}

		await this.updateActivityProcessingStatus(activityLogEntry, task);
	}

	/**
	 * Update the activity processing status.
	 * @param activityLogEntry The Activity Log entry to update.
	 * @param task background task details.
	 */
	private async updateActivityProcessingStatus(
		activityLogEntry: IActivityLogDetails,
		task: IBackgroundTask
	): Promise<void> {
		let nextStatus: ActivityProcessingStatus = activityLogEntry.status;
		switch (task.status) {
			case TaskStatus.Pending:
				break;
			case TaskStatus.Processing:
				if (activityLogEntry.status !== ActivityProcessingStatus.Error) {
					nextStatus = ActivityProcessingStatus.Running;
				}
				break;
			case TaskStatus.Success:
				if (activityLogEntry.status !== ActivityProcessingStatus.Error) {
					nextStatus = ActivityProcessingStatus.Completed;
				}
				break;
			case TaskStatus.Failed:
				nextStatus = ActivityProcessingStatus.Error;
				break;
		}

		activityLogEntry.status = nextStatus;
		activityLogEntry.dateUpdated = new Date().toISOString();

		await this._entityStorageActivityLogs.set(activityLogEntry);
	}

	/**
	 * Calculates the (Activity, Object, Target, Triple).
	 * @param compactedObj The compactObj representing the Activity.
	 * @returns the Activity, Object, Target, triple.
	 */
	private async calculateTriple(compactedObj: IActivity): Promise<IActivityObjectTargetTriple[]> {
		const expanded = await JsonLdProcessor.expand({
			"@context": compactedObj["@context"],
			"@type": compactedObj.type
		});
		const expandedDoc = expanded[0];
		const activityTypes = expandedDoc["@type"] as string[];

		if (Is.undefined(compactedObj.object["@context"])) {
			compactedObj.object["@context"] = compactedObj["@context"];
		}
		const objectExpanded = await JsonLdProcessor.expand(compactedObj.object);
		const objectTypes = objectExpanded[0]["@type"] as string[];

		let targetTypes: string[] | null[] = [null];
		if (Is.object(compactedObj.target)) {
			if (Is.undefined(compactedObj.target["@context"])) {
				compactedObj.target["@context"] = compactedObj["@context"];
			}
			const targetExpanded = await JsonLdProcessor.expand(compactedObj.target);
			targetTypes = targetExpanded[0]["@type"] as string[];
		}

		const result: IActivityObjectTargetTriple[] = [];

		for (const activityType of activityTypes) {
			for (const objectType of objectTypes) {
				for (const targetType of targetTypes) {
					const triple: IActivityObjectTargetTriple = {
						activityType,
						objectType,
						targetType: Is.null(targetType) ? undefined : targetType
					};

					result.push(triple);
				}
			}
		}

		return result;
	}
}
