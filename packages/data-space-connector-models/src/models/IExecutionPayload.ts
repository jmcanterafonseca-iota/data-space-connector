// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivity } from "@twin.org/standards-w3c-activity-streams";
import type { IDataSpaceConnectorAppDescriptor } from "./app/IDataSpaceConnectorAppDescriptor";

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
	executorApp: IDataSpaceConnectorAppDescriptor["id"];
}
