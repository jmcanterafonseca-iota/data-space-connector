// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * (Activity,Object,Target) Triple for denoting combinations to be handled by a DS Connector App
 */
export interface IActivityObjectTargetTriple {
	/**
	 * FQN of the Activity type.
	 */
	activityType?: string;

	/**
	 * FQN of the Object Type.
	 */
	objectType: string;

	/**
	 * FQN of the target type.
	 */
	targetType?: string;
}
