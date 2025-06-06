// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivity, IActivityHandler } from "@twin.org/data-space-connector-models";

/**
 * Test App Activity Handler.
 */
export class TestAppActivityHandler implements IActivityHandler {
	/**
	 * Handle Activity.
	 * @param act Activity
	 * @returns Activity processing result
	 */
	public async handleActivity(act: IActivity): Promise<unknown> {
		return new Promise(resolve => setTimeout(resolve, 50));
	}
}
