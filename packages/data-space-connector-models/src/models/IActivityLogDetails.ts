// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The details related to the processing of an Activity
 */
export interface IActivityLogDetails {
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
	 * The creation date of this object.
	 */
	dateCreated: string;

	/**
	 * The last update date of this object.
	 */
	dateUpdated: string;
}
