// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivity } from "../activity-streams/IActivity";

/**
 * Activity Handler.
 */
export interface IActivityHandler {
	/**
	 * Handles an Activity and report about results through the Data Space Connector Callback
	 * @param activity The Activity to be handled
	 * @returns The result of executing the Activity.
	 */
	handleActivity(activity: IActivity): Promise<unknown>;
}
