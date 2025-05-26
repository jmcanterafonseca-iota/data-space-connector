// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Data Space Connector Callback interface.
 */
export interface IDataSpaceConnectorCallback {
	/**
	 * Callback invoked by a Data Space Connector App when the processing of an Activity has finalized.
	 * @param activityId The Activity Id.
	 * @param result The processing result.
	 * @param error Error (if there was any).
	 * @returns nothing.
	 */
	activityProcessingFinalized(activityId: string, result?: unknown, error?: Error): Promise<void>;
}
