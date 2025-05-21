// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ActivityStreamsLdContextType } from "../activityStreamsLdContextType";

/**
 * A W3C Activity from Activity Streams
 * @see https://www.w3.org/TR/activitystreams-core/#activities
 */
export interface IActivity extends IJsonLdNodeObject {
	/**
	 * The LD Context.
	 */
	"@context": ActivityStreamsLdContextType;
}
