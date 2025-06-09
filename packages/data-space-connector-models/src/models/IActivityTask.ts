// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivityLogDetails } from "./IActivityLogDetails";
import type { ITaskApp } from "./ITaskApp";

/**
 * Denotes a task associated with an Activity
 */
export interface IActivityTask {
	/**
	 * The activity log entry.
	 */
	activityLogEntryId: IActivityLogDetails["id"];

	/**
	 * The associated tasks
	 */
	associatedTasks: ITaskApp[];
}
