// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import {
	Is,
	type IValidationFailure,
	NotFoundError,
	StringHelper,
	Validation
} from "@twin.org/core";
import { JsonLdHelper, type IJsonLdDocument } from "@twin.org/data-json-ld";
import {
	type IActivity,
	type IDataSpaceConnector,
	type IDataSpaceConnectorApp,
	type IActivityLogEntry,
	type ISubscription,
	type ISubscriptionEntry,
	type IDataSpaceQuery,
	DataSpaceConnectorDataTypes
} from "@twin.org/data-space-connector-models";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { LoggingConnectorFactory, type ILoggingConnector } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { ActivityLogEntry } from "./entities/activityLogEntry";
import type { SubscriptionEntry } from "./entities/subscriptionEntry";
import { HandlerRegistry } from "./handlerRegistry";
import type { IDataSpaceConnectorServiceConstructorOptions } from "./models/IDataSpaceConnectorServiceConstructorOptions";

/**
 * Data Space Connector Service.
 */
export class DataSpaceConnectorService implements IDataSpaceConnector {
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
	 * Storage service for participants.
	 * @internal
	 */
	private readonly _entityStorageSubscriptions: IEntityStorageConnector<SubscriptionEntry>;

	/**
	 * Storage service for activity logging.
	 * @internal
	 */
	private readonly _entityStorageActivityLogs: IEntityStorageConnector<ActivityLogEntry>;

	/**
	 * Handler registry of Data Space Connector Apps.
	 */
	private readonly _handlerRegistry: HandlerRegistry;

	/**
	 * Create a new instance of FederatedCatalogue service.
	 * @param options The options for the connector.
	 */
	constructor(options: IDataSpaceConnectorServiceConstructorOptions) {
		this._loggingService = LoggingConnectorFactory.getIfExists(
			options?.loggingConnectorType ?? "logging"
		);

		this._entityStorageActivityLogs = EntityStorageConnectorFactory.get<
			IEntityStorageConnector<ActivityLogEntry>
		>(options.activityLogEntityStorageType ?? StringHelper.kebabCase(nameof<ActivityLogEntry>()));

		this._entityStorageSubscriptions = EntityStorageConnectorFactory.get<
			IEntityStorageConnector<SubscriptionEntry>
		>(options.subscriptionEntityStorageType ?? StringHelper.kebabCase(nameof<SubscriptionEntry>()));

		this._handlerRegistry = new HandlerRegistry();

		DataSpaceConnectorDataTypes.registerTypes();
	}

	/**
	 * Notify an Activity.
	 * @param activity The Activity notified.
	 * @returns The Activity's Log Entry identifier.
	 */
	public async notifyActivity(activity: IActivity): Promise<string> {
		const validationFailures: IValidationFailure[] = [];
		const result = await JsonLdHelper.validate(activity, validationFailures);

		console.log(JSON.stringify(validationFailures), null, 2);
		Validation.asValidationError(this.CLASS_NAME, nameof(activity), validationFailures);
		return "";
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

		return result;
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
	public registerDataSpaceConnectorApp(app: IDataSpaceConnectorApp): void {
		const objectTypes = app.handledTypes.activityObjectTypes;

		if (Is.arrayValue(objectTypes)) {
			for (const objectType of objectTypes) {
				this._handlerRegistry.setHandlerForActivityObjectType(objectType, app);
			}
		}
	}
}
