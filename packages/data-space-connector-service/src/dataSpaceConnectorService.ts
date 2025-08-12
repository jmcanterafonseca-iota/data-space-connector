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
	type IError,
	Guards,
	RandomHelper,
	ComponentFactory,
	GuardError
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
	type IDataSpaceConnector,
	type IActivityLogEntry,
	type ISubscription,
	type ISubscriptionEntry,
	type IDataSpaceQuery,
	ActivityProcessingStatus,
	type IActivityObjectTargetTriple,
	type IDataSpaceConnectorAppDescriptor,
	type IActivityLogDetails,
	type ITaskApp,
	type IExecutionPayload,
	type IDataSpaceConnectorApp,
	type IActivityLogStatusNotification
} from "@twin.org/data-space-connector-models";
import { EngineCoreFactory, type IEngineCoreTypeConfig } from "@twin.org/engine-models";
import { LoggingConnectorType } from "@twin.org/engine-types";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { ModuleHelper } from "@twin.org/modules";
import { nameof } from "@twin.org/nameof";
import { SchemaOrgDataTypes } from "@twin.org/standards-schema-org";
import { ActivityStreamsDataTypes, type IActivity } from "@twin.org/standards-w3c-activity-streams";
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
	 * DS Connector App Component Type.
	 * @internal
	 */
	private static readonly _DS_CONNECTOR_APP_COMPONENT_TYPE: string =
		nameof<IDataSpaceConnectorApp>();

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<DataSpaceConnectorService>();

	/**
	 * Logging service.
	 * @internal
	 */
	private readonly _loggingService?: ILoggingComponent;

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
	 * Background Task Connector.
	 * @internal
	 */
	private readonly _backgroundTaskConnector: IBackgroundTaskConnector;

	/**
	 * Initial set of Data Space Connector Apps
	 * @internal
	 */
	private readonly _initialDataSpaceConnectorApps?: IDataSpaceConnectorAppDescriptor[];

	/**
	 * Activity Log Status callbacks.
	 * @internal
	 */
	private readonly _activityLogStatusCallbacks: {
		[key: string]: (notification: IActivityLogStatusNotification) => Promise<void>;
	};

	/**
	 * Create a new instance of FederatedCatalogue service.
	 * @param options The options for the connector.
	 */
	constructor(options: IDataSpaceConnectorServiceConstructorOptions) {
		this._loggingService = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging-service"
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
			options?.backgroundTaskConnectorType ?? "background-task-service"
		);
		this._appRegistry = new AppRegistry();

		JsonLdDataTypes.registerTypes();
		ActivityStreamsDataTypes.registerTypes();
		SchemaOrgDataTypes.registerRedirects();

		this._initialDataSpaceConnectorApps = options.config.dataSpaceConnectorAppDescriptors;

		this._activityLogStatusCallbacks = {};
	}

	/**
	 * Start step. It just registers the Data Space Connector Apps initial descriptors.
	 * @param nodeIdentity Node Identity
	 * @param nodeLoggingConnectorType Node Logging Connector type.
	 */
	public async start(nodeIdentity: string, nodeLoggingConnectorType?: string): Promise<void> {
		if (Is.arrayValue(this._initialDataSpaceConnectorApps)) {
			for (const app of this._initialDataSpaceConnectorApps) {
				await this.registerDataSpaceConnectorApp(app);
			}
		}
	}

	/**
	 * Notify an Activity.
	 * @param activity The Activity notified.
	 * @returns The Activity's Log Entry identifier.
	 */
	public async notifyActivity(activity: IActivity): Promise<string> {
		this._loggingService?.log({
			level: "debug",
			source: this.CLASS_NAME,
			message: "dataSpaceConnectorService.newActivity",
			data: {
				activityType: activity.type,
				generator: this.calculateActivityGeneratorIdentity(activity)
			}
		});

		// Validate that the Activity notified is encoded using the representation format expected by the Connector
		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(activity, validationFailures, { failOnMissingType: true });
		Validation.asValidationError(this.CLASS_NAME, nameof(activity), validationFailures);

		// Avoid using terms not defined in any Ld Context
		const compactedObj = await JsonLdProcessor.compact(activity, activity["@context"]);

		// Calculate Activity Log Entry Id
		const canonical = await JsonLdProcessor.canonize(compactedObj);
		const canonicalBytes = Converter.utf8ToBytes(canonical);
		const activityLogId = Converter.bytesToHex(Blake2b.sum256(canonicalBytes));
		const activityLogEntryId = `urn:x-activity-log:${activityLogId}`;

		// Avoid duplicates
		const entryExists = !Is.undefined(
			await this._entityStorageActivityLogs.get(activityLogEntryId)
		);
		if (entryExists) {
			throw new ConflictError(this.CLASS_NAME, "activityAlreadyNotified", activityLogEntryId);
		}

		// First of all Activity Log Entry is created
		const logEntry: IActivityLogDetails = {
			id: activityLogEntryId,
			generator: this.calculateActivityGeneratorIdentity(activity),
			dateCreated: new Date().toISOString(),
			dateModified: new Date().toISOString()
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
				// This is needed because the Background Task component does not support multiple tasks of
				// the same type executing at the same time
				const taskType = Converter.bytesToHex(RandomHelper.generate(16));
				const taskId = await this._backgroundTaskConnector.create<IExecutionPayload>(
					taskType,
					payload,
					{
						retainFor: -1
					}
				);

				this._backgroundTaskConnector.registerHandler<IExecutionPayload, unknown>(
					taskType,
					"@twin.org/data-space-connector-app-runner",
					"appRunner",
					async task => {
						await this.finaliseTask(task);
					}
				);

				tasksScheduled.push({
					taskId,
					dataSpaceConnectorAppId: dataSpaceConnectorApp.id
				});

				await this._loggingService?.log({
					level: "info",
					source: this.CLASS_NAME,
					message: "scheduledTask",
					data: {
						taskId,
						dataSpaceConnectorAppId: dataSpaceConnectorApp.id
					}
				});
			}
		}

		// This might happen after the tasks have been scheduled and actually finalized so there can be temporary
		// inconsistencies in the data that will be eventually solved
		await this._entityStorageActivityTasks.set({
			activityLogEntryId,
			associatedTasks: tasksScheduled
		});

		return activityLogEntryId;
	}

	/**
	 * Subscribes to the activity log.
	 * @param callback The callback to be called when Activity Log is called.
	 * @param subscriptionId The Subscription Id.
	 * @returns The subscription Id.
	 */
	public subscribeToActivityLog(
		callback: (notification: IActivityLogStatusNotification) => Promise<void>,
		subscriptionId?: string
	): string {
		Guards.function(this.CLASS_NAME, nameof(callback), callback);

		const theSubscriptionId = Is.stringValue(subscriptionId)
			? subscriptionId
			: Converter.bytesToHex(RandomHelper.generate(16));
		this._activityLogStatusCallbacks[theSubscriptionId] = callback;

		return theSubscriptionId;
	}

	/**
	 * Subscribes to the activity log.
	 * @param subscriptionId The Subscription Id.
	 */
	public unSubscribeToActivityLog(subscriptionId: string): void {
		delete this._activityLogStatusCallbacks[subscriptionId];
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
			throw new NotFoundError(this.CLASS_NAME, "activityLogEntryNotFound", logEntryId);
		}

		let pendingTasks: IActivityLogEntry["pendingTasks"];
		let runningTasks: IActivityLogEntry["runningTasks"];
		let finalizedTasks: IActivityLogEntry["finalizedTasks"];
		let inErrorTasks: IActivityLogEntry["inErrorTasks"];

		// For calculating the processing status. Unknown if we cannot determine the activity tasks
		let status: ActivityProcessingStatus = ActivityProcessingStatus.Unknown;

		// Now query the associated tasks
		const activityTasks = await this._entityStorageActivityTasks.get(logEntryId);

		// If activity tasks is undefined it is because the corresponding store has not been persisted yet
		if (!Is.undefined(activityTasks)) {
			pendingTasks = [];
			runningTasks = [];
			finalizedTasks = [];
			inErrorTasks = [];

			for (const entity of activityTasks.associatedTasks) {
				const taskDetails = await this._backgroundTaskConnector.get<IExecutionPayload, unknown>(
					entity.taskId
				);

				switch (taskDetails?.status) {
					case TaskStatus.Success:
						finalizedTasks.push({
							...(entity as ITaskApp),
							result: JSON.stringify(taskDetails?.result),
							startDate: taskDetails?.dateCreated,
							endDate: taskDetails?.dateCompleted
						});
						break;

					case TaskStatus.Pending:
						pendingTasks.push({ ...(entity as ITaskApp) });
						break;

					case TaskStatus.Processing:
						runningTasks?.push({ ...(entity as ITaskApp), startDate: taskDetails?.dateCreated });
						break;

					case TaskStatus.Failed:
						inErrorTasks.push({
							...(entity as ITaskApp),
							error: taskDetails.error as IError
						});
				}
			}
			if (inErrorTasks.length > 0) {
				status = ActivityProcessingStatus.Error;
			} else if (runningTasks.length > 0) {
				status = ActivityProcessingStatus.Running;
			} else if (pendingTasks.length > 0) {
				status = ActivityProcessingStatus.Pending;
			} else {
				status = ActivityProcessingStatus.Completed;
			}
		}
		return { ...result, status, pendingTasks, runningTasks, finalizedTasks, inErrorTasks };
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
			throw new NotFoundError(this.CLASS_NAME, "subscriptionEntryNotFound", entryId);
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
	public async registerDataSpaceConnectorApp(app: IDataSpaceConnectorAppDescriptor): Promise<void> {
		const activityObjectTargetTriples = app.handledTypes.activityObjectTargetTriples;

		if (Is.arrayValue(activityObjectTargetTriples)) {
			for (const triple of activityObjectTargetTriples) {
				this._appRegistry.setAppForActivityObjectTargetTriple(triple, app);
			}
		}

		const customTypeConfig: IEngineCoreTypeConfig[] = [
			{
				type: `${DataSpaceConnectorService._DS_CONNECTOR_APP_COMPONENT_TYPE}${app.id}`,
				options: {
					loggingConnectorType: LoggingConnectorType.Console,
					dataSpaceConnectorAppId: app.id,
					config: {}
				}
			}
		];

		// Register within the Engine so that it can be cloned in the future
		const engine = EngineCoreFactory.getIfExists("engine");
		if (!Is.undefined(engine)) {
			engine.addTypeInitialiser(
				`${DataSpaceConnectorService._DS_CONNECTOR_APP_COMPONENT_TYPE}${app.id}`,
				customTypeConfig,
				app.moduleName,
				app.initialiserName ?? "appInitialiser"
			);
		}

		// Instantiate the application so that it will be registered in the ComponentFactory
		await ModuleHelper.execModuleMethod(app.moduleName, app.initialiserName ?? "appInitialiser", [
			engine,
			null,
			{ options: customTypeConfig[0].options },
			null
		]);
	}

	/**
	 * Calculates the activity generator from the generator or actor fields.
	 * @param activity The activity.
	 * @returns The generator's identity.
	 * @throws General Error if no identity is found.
	 */
	private calculateActivityGeneratorIdentity(activity: IActivity): string {
		if (Is.string(activity.generator)) {
			return activity.generator;
		}

		if (Is.object<IJsonLdNodeObject>(activity.generator) && Is.string(activity.generator.id)) {
			return activity.generator.id;
		}

		if (Is.string(activity.actor)) {
			return activity.actor;
		}

		if (Is.object<IJsonLdNodeObject>(activity.actor) && Is.string(activity.actor.id)) {
			return activity.actor.id;
		}

		throw new GuardError(
			this.CLASS_NAME,
			"invalidActivityGeneratorIdentity",
			nameof(activity.generator),
			{
				generator: activity.generator,
				actor: activity.actor
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
				message: "unknownActivityLogEntryId",
				data: {
					activityLogEntryId: payload.activityLogEntryId
				}
			});
		}

		if (task.status === TaskStatus.Success || task.status === TaskStatus.Failed) {
			for (const callback of Object.values(this._activityLogStatusCallbacks)) {
				await callback({
					activityLogEntryId: payload.activityLogEntryId,
					taskProcessingStatus: {
						dataSpaceConnectorAppId: payload.executorApp,
						taskId: task.id,
						taskStatus: task.status
					}
				});
			}
		}
	}

	/**
	 * Calculates the (Activity, Object, Target, Triple).
	 * @param compactedObj The compactObj representing the Activity.
	 * @returns the Activity, Object, Target, triple.
	 * @internal
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
