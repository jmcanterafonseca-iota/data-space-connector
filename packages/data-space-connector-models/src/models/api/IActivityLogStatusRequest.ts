// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Activity log status
 */
export interface IActivityLogStatusRequest {
	/**
	 * Empty body.
	 */
	body: {
		operation: "subscribe" | "unsubscribe";
	};
}
