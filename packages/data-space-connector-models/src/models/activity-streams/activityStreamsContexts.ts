// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The LD Contexts concerning Activity Streams.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ActivityStreamsContexts = {
	/**
	 * The Gaia-X LD Context.
	 */
	ActivityStreamsLdContext: "https://www.w3.org/ns/activitystreams",

	/**
	 * XML Schema LD Context.
	 */
	XmlSchemaLdContext: "http://www.w3.org/2001/XMLSchema#",

	/**
	 * Linked Data Platform Vocabulary.
	 */
	LdpLdContext: "http://www.w3.org/ns/ldp#",

	/**
	 * The Activity Streams namespace.
	 */
	ActivityStreamsNamespace: "https://www.w3.org/ns/activitystreams#"
} as const;

/**
 * The LD Contexts concerning Gaia-X.
 */
export type ActivityStreamsContexts =
	(typeof ActivityStreamsContexts)[keyof typeof ActivityStreamsContexts];
