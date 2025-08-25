// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig, ICreatedResponse } from "@twin.org/api-models";
import { Is, NotSupportedError } from "@twin.org/core";
import type {
	IActivityLogEntry,
	IActivityLogEntryGetRequest,
	IActivityLogEntryGetResponse,
	IActivityLogStatusNotification,
	IActivityStreamNotifyRequest,
	IDataSpaceConnector,
	IDataSpaceConnectorAppDescriptor
} from "@twin.org/data-space-connector-models";
import { nameof } from "@twin.org/nameof";
import type { IActivity } from "@twin.org/standards-w3c-activity-streams";
import { HeaderTypes } from "@twin.org/web";

/**
 * The client to connect to the data space connector service.
 */
export class DataSpaceConnectorClient extends BaseRestClient implements IDataSpaceConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<DataSpaceConnectorClient>();

	/**
	 * Create a new instance of DataSpaceConnectorClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<DataSpaceConnectorClient>(), config, "");
	}

	/**
	 * Notify an Activity to the DS Connector Activity Stream.
	 * @param activity The Activity notified.
	 * @returns The Activity's identifier.
	 */
	public async notifyActivity(activity: IActivity): Promise<string> {
		const response = await this.fetch<IActivityStreamNotifyRequest, ICreatedResponse>(
			"/notify",
			"POST",
			{
				body: activity
			}
		);
		const parts = response.headers[HeaderTypes.Location].split("/");
		return Is.arrayValue<string>(parts) ? parts[parts.length - 1] : "";
	}

	/**
	 * Subscribes to the activity log - implemented in Socket Client.
	 * @param callback The callback to be called when Activity Log is called.
	 * @param subscriptionId The subscription Id.
	 * @returns The subscription Id.
	 */
	public async subscribeToActivityLog(
		callback: (notification: IActivityLogStatusNotification) => Promise<void>,
		subscriptionId?: string
	): Promise<string> {
		// This is in the socket client
		throw new NotSupportedError(this.CLASS_NAME, nameof("subscribeToActivityLog"));
	}

	/**
	 * Unsubscribes to the activity log - implemented in Socket Client.
	 * @param subscriptionId The subscription Id.
	 * @returns The subscription Id.
	 */
	public async unSubscribeToActivityLog(subscriptionId: string): Promise<void> {
		// This is in the socket client
		throw new NotSupportedError(this.CLASS_NAME, nameof("unSubscribeToActivityLog"));
	}

	/**
	 * Returns Activity Log Entry which contains the Activity processing details.
	 * @param logEntryId The Id of the Activity Log Entry (a URI).
	 * @returns the Activity Log Entry with the processing details.
	 * @throws NotFoundError if activity log entry is not known.
	 */
	public async getActivityLogEntry(logEntryId: string): Promise<IActivityLogEntry> {
		const response = await this.fetch<IActivityLogEntryGetRequest, IActivityLogEntryGetResponse>(
			"/activity-logs/:id",
			"GET",
			{
				pathParams: {
					id: logEntryId
				}
			}
		);
		return response.body;
	}

	/**
	 * Registers a Data Space Connector App.
	 * @param app The descriptor of the App to be registered.
	 * @returns nothing.
	 */
	public async registerDataSpaceConnectorApp(app: IDataSpaceConnectorAppDescriptor): Promise<void> {
		// Don't want client to be able to register apps remotely
		throw new NotSupportedError(this.CLASS_NAME, nameof("registerDataSpaceConnectorApp"));
	}
}
