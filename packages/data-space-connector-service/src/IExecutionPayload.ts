// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivity, IDataSpaceConnectorApp } from "@twin.org/data-space-connector-models";

/**
 * Execution payload.
 */
export interface IExecutionPayload {
	/**
	 * The Activity Log Entry Id.
	 */
	activityLogEntryId: string;

	/**
	 * The activity
	 */
	activity: IActivity;

	/**
	 * The executor App.
	 */
	executorApp: IDataSpaceConnectorApp;
}
