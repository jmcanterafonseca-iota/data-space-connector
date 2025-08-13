// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IBackgroundTask } from "@twin.org/background-task-models";
import type { IDataSpaceConnectorAppDescriptor } from "./app/IDataSpaceConnectorAppDescriptor";

/**
 * The status supplied to clients of the Data Space Connector
 */
export interface IActivityLogStatusNotification {
	/**
	 * The activity log entry id.
	 */
	activityLogEntryId: string;

	/**
	 * The activity Id.
	 */
	activityId?: string;

	/**
	 * The activity processing status through the associated tasks.
	 */
	taskProcessingStatus: {
		/**
		 * The task reported.
		 */
		taskId: IBackgroundTask["id"];

		/**
		 * The Data Space Connector App.
		 */
		dataSpaceConnectorAppId: IDataSpaceConnectorAppDescriptor["id"];

		/**
		 * The status of the task reported. Only terminated and error are reported.
		 */
		taskStatus: IBackgroundTask["status"];
	};
}
