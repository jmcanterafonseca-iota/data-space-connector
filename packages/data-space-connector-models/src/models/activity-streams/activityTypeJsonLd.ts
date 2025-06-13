// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ActivityType } from "./activityType";

/**
 * Activity Type JSON-LD
 */
export type ActivityTypeJsonLd =
	| ActivityType
	| [ActivityType]
	// Workaround for the buggy ts-to-schema behaviour
	| [ActivityType, ...string[]];
