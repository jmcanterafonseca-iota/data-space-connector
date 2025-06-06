// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IExecutionPayload } from "@twin.org/data-space-connector-models";
import type { IEngineCoreClone } from "@twin.org/engine-models";
import { TestAppActivityHandler } from "./testAppActivityHandler";

/**
 * Data Space Connector Task.
 * @param engineCloneData The Engine.
 * @param payload The payload
 * @returns The execution result.
 */
export async function executeTask(
	engineCloneData: IEngineCoreClone,
	payload: IExecutionPayload
): Promise<unknown> {
	console.log("execute called", payload);

	const executor = new TestAppActivityHandler();

	return executor.handleActivity(payload.activity);
}
