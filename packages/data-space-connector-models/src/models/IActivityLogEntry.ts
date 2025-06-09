// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IError } from "@twin.org/core";
import type { IActivityLogDetails } from "./IActivityLogDetails";
import type { ITaskApp } from "./ITaskApp";

/**
 * The details related to the processing of an Activity
 */
export interface IActivityLogEntry extends IActivityLogDetails {
	/**
	 * The tasks this activity log entry is in association with.
	 */
	associatedTasks?: ITaskApp[];

	/**
	 * The tasks that have already finalized.
	 */
	finalizedTasks?: (ITaskApp & {
		/**
		 * The task result.
		 */
		result: string;
	})[];

	/**
	 * The tasks that are in error.
	 */
	inErrorTasks?: (ITaskApp & {
		/**
		 * The error that happened
		 */
		error: IError;
	})[];
}
