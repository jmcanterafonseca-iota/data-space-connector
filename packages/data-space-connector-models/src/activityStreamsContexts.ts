// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The LD Contexts concerning Activity Streams.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ActivityStreamsContexts = {
	/**
	 * The Gaia-X LD Context
	 */
	ActivityStreamsLdContext: "https://www.w3.org/ns/activitystreams"
} as const;

/**
 * The LD Contexts concerning Gaia-X.
 */
export type GaiaXContexts = (typeof ActivityStreamsContexts)[keyof typeof ActivityStreamsContexts];
