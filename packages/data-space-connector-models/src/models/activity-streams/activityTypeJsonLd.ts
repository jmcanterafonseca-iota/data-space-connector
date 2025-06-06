// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdKeyword } from "@twin.org/data-json-ld";
import type { ActivityType } from "./activityType";

/**
 * Activity Type JSON-LD
 */
export type ActivityTypeJsonLd =
	| ActivityType
	| [ActivityType]
	| [ActivityType, ...IJsonLdKeyword["@type"][]]
	// Workaround for the buggy ts-to-schema behaviour
	| [ActivityType, ...string[]];
