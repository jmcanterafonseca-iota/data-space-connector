// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Activity processing statuses.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ActivityProcessingStatus = {
	/**
	 * Pending: Activity Processing has not started yet.
	 */
	Pending: "pending",

	/**
	 * Running Activity processing is running.
	 */
	Running: "running",

	/**
	 * Completed: Activity processing completed without error.
	 */
	Completed: "completed",

	/**
	 * Failed: Activity processing failed (i.e. exception happened).
	 */
	Failed: "failed",

	/**
	 * Error: Activity processing cannot be performed and marked as in error. (Depends on application).
	 */
	Error: "error"
} as const;

/**
 * The type exported.
 */
export type ActivityProcessingStatus =
	(typeof ActivityProcessingStatus)[keyof typeof ActivityProcessingStatus];
