// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IComponent } from "@twin.org/core";
import type { IJsonLdDocument } from "@twin.org/data-json-ld";
import type { IActivity } from "@twin.org/standards-w3c-activity-streams";
import type { IDataSpaceConnectorAppDescriptor } from "./models/app/IDataSpaceConnectorAppDescriptor";
import type { IActivityLogEntry } from "./models/IActivityLogEntry";
import type { IActivityLogStatusNotification } from "./models/IActivityLogStatusNotification";
import type { IDataSpaceQuery } from "./models/IDataSpaceQuery";
import type { ISubscription } from "./models/ISubscription";
import type { ISubscriptionEntry } from "./models/ISubscriptionEntry";

/**
 * Data Space Connector service interface.
 */
export interface IDataSpaceConnector extends IComponent {
	/**
	 * Start method.
	 * @param nodeIdentity Node Identity.
	 * @param nodeLoggingConnectorType Node Logging Connector Type.
	 * @returns nothing
	 */
	start(nodeIdentity: string, nodeLoggingConnectorType?: string): Promise<void>;

	/**
	 * Notify an Activity to the DS Connector Activity Stream.
	 * @param activity The Activity notified.
	 * @returns The Activity's identifier.
	 */
	notifyActivity(activity: IActivity): Promise<string>;

	/**
	 * Subscribes to the activity log.
	 * @param callback The callback to be called when Activity Log is called.
	 * @param subscriptionId The subscription Id.
	 * @returns The subscription Id.
	 */
	subscribeToActivityLog(
		callback: (notification: IActivityLogStatusNotification) => Promise<void>,
		subscriptionId?: string
	): string;

	/**
	 * Unsubscribes to the activity log.
	 * @param subscriptionId The subscription Id.
	 * @returns The subscription Id.
	 */
	unSubscribeToActivityLog(
		subscriptionId: string
	): void;

	/**
	 * Returns Activity Log Entry which contains the Activity processing details.
	 * @param logEntryId The Id of the Activity Log Entry (a URI).
	 * @returns the Activity Log Entry with the processing details.
	 * @throws NotFoundError if activity log entry is not known.
	 */
	getActivityLogEntry(logEntryId: string): Promise<IActivityLogEntry>;

	/**
	 * Subscribe to the Data Space Connector.
	 * @param subscription The subscription
	 * @returns The Subscription Entry identifier.
	 */
	subscribe(subscription: ISubscription): Promise<string>;

	/**
	 * Returns a subscription entry.
	 * @param entryId The entry Id (a URI)
	 * @returns The subscription entry with all Subscription details
	 */
	getSubscriptionEntry(entryId: string): Promise<ISubscriptionEntry>;

	/**
	 * Gets data associated with a Service Offering.
	 * @param dataResourceId The corresponding Data Resource as registered on the Federated Catalogue.
	 * @param serviceOfferingId The Service Offering Id as registered on the Federated Catalogue.
	 * @param query The Data Space Connector query.
	 * @returns a JSON-LD document with the data
	 */
	getData(
		dataResourceId: string,
		serviceOfferingId?: string,
		query?: IDataSpaceQuery
	): Promise<IJsonLdDocument>;

	/**
	 * Registers a Data Space Connector App.
	 * @param app The descriptor of the App to be registered.
	 * @returns nothing.
	 */
	registerDataSpaceConnectorApp(app: IDataSpaceConnectorAppDescriptor): Promise<void>;
}
