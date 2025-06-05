// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Data Space Connector Task.
 * @param engineCloneData The Engine.
 * @param payload The payload
 * @returns The execution result.
 */
export async function execute(engineCloneData, payload) {
	console.log('execute called');
	return payload.executorApp.handleActivity(payload.activity);
}
