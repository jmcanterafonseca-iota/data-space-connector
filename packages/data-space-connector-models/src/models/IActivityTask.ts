// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IBackgroundTask } from "@twin.org/background-task-models";
import type { IDataSpaceConnectorApp } from "./app/IDataSpaceConnectorApp";

/**
 * Denotes a task associated with an Activity
 */
export interface IActivityTask {
	/**
	 * Task Id.
	 */
	taskId: IBackgroundTask["id"];

	/**
	 * Data Space Connector App Id.
	 */
	dataSpaceConnectorAppId: IDataSpaceConnectorApp["id"];
}
