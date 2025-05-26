// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivityLogEntry } from "../IActivityLogEntry";

/**
 * Service Offering response
 */
export interface IActivityLogEntryGetResponse {
	/**
	 * The response payload.
	 */
	body: IActivityLogEntry;
}
