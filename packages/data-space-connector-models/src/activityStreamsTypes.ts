// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The types concerning Activity Streams.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ActivityStreamsTypes = {
	/**
	 * Activity
	 */
	Activity: "Activity"
} as const;

/**
 * The types concerning Gaia-X.
 */
export type ActivityStreamsTypes = (typeof ActivityStreamsTypes)[keyof typeof ActivityStreamsTypes];
