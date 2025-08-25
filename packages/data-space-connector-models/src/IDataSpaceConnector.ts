// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IComponent } from "@twin.org/core";
import type { IActivity } from "@twin.org/standards-w3c-activity-streams";
import type { IDataSpaceConnectorAppDescriptor } from "./models/app/IDataSpaceConnectorAppDescriptor";
import type { IActivityLogEntry } from "./models/IActivityLogEntry";
import type { IActivityLogStatusNotification } from "./models/IActivityLogStatusNotification";

/**
 * Data Space Connector service interface.
 */
export interface IDataSpaceConnector extends IComponent {
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
	): Promise<string>;

	/**
	 * Unsubscribes to the activity log.
	 * @param subscriptionId The subscription Id.
	 * @returns The subscription Id.
	 */
	unSubscribeToActivityLog(subscriptionId: string): Promise<void>;

	/**
	 * Returns Activity Log Entry which contains the Activity processing details.
	 * @param logEntryId The Id of the Activity Log Entry (a URI).
	 * @returns the Activity Log Entry with the processing details.
	 * @throws NotFoundError if activity log entry is not known.
	 */
	getActivityLogEntry(logEntryId: string): Promise<IActivityLogEntry>;

	/**
	 * Registers a Data Space Connector App.
	 * @param app The descriptor of the App to be registered.
	 * @returns nothing.
	 */
	registerDataSpaceConnectorApp(app: IDataSpaceConnectorAppDescriptor): Promise<void>;
}
