// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IError } from "@twin.org/core";
import type { ActivityProcessingStatus } from "./activityProcessingStatus";
import type { IActivityTask } from "./IActivityTask";

/**
 * The details related to the processing of an Activity
 */
export interface IActivityLogEntry {
	/**
	 * The Id of the Activity Log entry.
	 */
	id: string;

	/**
	 * The activity Id that this entry refers to. This is obtained through a hash of the Activity itself.
	 */
	activityId?: string;

	/**
	 * The identity of the Activity's generator.
	 */
	generator: string;

	/**
	 * Status of the Activity Processing.
	 */
	status: ActivityProcessingStatus;

	/**
	 * The creation date of this object.
	 */
	dateCreated: string;

	/**
	 * The last update date of this object.
	 */
	dateUpdated: string;

	/**
	 * The tasks this activity log entry is in association with.
	 */
	associatedTasks: IActivityTask[];

	/**
	 * The tasks that have already finalized.
	 */
	finalizedTasks: (IActivityTask & {
		/**
		 * The task result.
		 */
		result: string;
	})[];

	/**
	 * The tasks that are in error.
	 */
	inErrorTasks: (IActivityTask & {
		/**
		 * The error that happened
		 */
		error: IError;
	})[];
}
