// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivity } from "@twin.org/standards-w3c-activity-streams";

/**
 * Activity Stream Request.
 */
export interface IActivityStreamRequest {
	/**
	 * The Activity sent to the Stream.
	 */
	body: IActivity;
}
