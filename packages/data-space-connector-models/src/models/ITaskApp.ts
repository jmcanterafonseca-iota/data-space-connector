// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IBackgroundTask } from "@twin.org/background-task-models";
import type { IDataSpaceConnectorAppDescriptor } from "./app/IDataSpaceConnectorAppDescriptor";

/**
 * Denotes a task associated with a Data Space Connector App
 */
export interface ITaskApp {
	/**
	 * Task Id.
	 */
	taskId: IBackgroundTask["id"];

	/**
	 * Data Space Connector App Id.
	 */
	dataSpaceConnectorAppId: IDataSpaceConnectorAppDescriptor["id"];
}
