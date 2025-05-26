// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ActivityProcessingStatus } from "./activityProcessingStatus";

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
	 * Activity processing start time (filled if it has actually started).
	 */
	startTime?: string;

	/**
	 * Activity's end time (filled if it has actually finished).
	 */
	endTime?: string;

	/**
	 * The result of processing the Activity.
	 */
	processingResult?: unknown;

	/**
	 * Error resulting from processing the Activity.
	 */
	processingError?: Error;
}
