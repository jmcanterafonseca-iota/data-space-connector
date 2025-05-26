// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ISubscription } from "../ISubscription";

/**
 * Subscription Creation Request.
 */
export interface ISubscriptionCreateRequest {
	/**
	 * The Subscription to be created.
	 */
	body: ISubscription;
}
