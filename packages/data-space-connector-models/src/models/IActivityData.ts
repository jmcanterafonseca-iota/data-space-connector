// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type {
	IJsonLdKeyword,
	IJsonLdLanguageMap,
	IJsonLdNodeObject,
	IJsonLdObject
} from "@twin.org/data-json-ld";

/**
 * A W3C Activity from Activity Streams
 * @see https://www.w3.org/TR/activitystreams-core/#activities
 */
export interface IActivityData {
	/**
	 * The generator of the Activity.
	 */
	generator?: IJsonLdKeyword["@id"] | IJsonLdNodeObject;

	/**
	 * The Actor behind the Activity.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-actor
	 */
	actor: IJsonLdKeyword["@id"] | IJsonLdNodeObject;

	/**
	 * The object affected by the Activity.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
	 */
	object: IJsonLdObject & { [key: string]: unknown };

	/**
	 * The target of the Activity.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-target
	 */
	target?: IJsonLdObject & { [key: string]: unknown };

	/**
	 * Summary of the Activity.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-summary
	 */
	summary?: string | IJsonLdLanguageMap;

	/**
	 * Result of the Activity.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-result
	 */
	result?: IJsonLdNodeObject;

	/**
	 * Activity's origin.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-origin
	 */
	origin?: IJsonLdKeyword["@id"] | IJsonLdNodeObject;

	/**
	 * The date and time at which the object was updated.
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-updated
	 */
	updated: string;
}
