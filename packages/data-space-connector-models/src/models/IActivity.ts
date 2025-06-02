// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdObject } from "@twin.org/data-json-ld";
import type { ActivityStreamsLdContextType } from "../activityStreamsLdContextType";
import type { ActivityTypeJsonLd } from "./activityType";
import type { IActivityData } from "./IActivityData";

/**
 * A W3C Activity from Activity Streams
 * @see https://www.w3.org/TR/activitystreams-core/#activities
 */
export type IActivity =
	| (IJsonLdObject &
			IActivityData & {
				/**
				 * The LD Context.
				 */
				"@context": ActivityStreamsLdContextType;
				type: ActivityTypeJsonLd;
				"@type"?: ActivityTypeJsonLd;
			})
	| (IJsonLdObject &
			IActivityData & {
				/**
				 * The LD Context.
				 */
				"@context": ActivityStreamsLdContextType;
				"@type"?: ActivityTypeJsonLd;
				type?: ActivityTypeJsonLd;
			});
