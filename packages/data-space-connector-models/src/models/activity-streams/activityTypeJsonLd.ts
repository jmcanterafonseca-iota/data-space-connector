// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ActivityStreamsTypes } from "./activityStreamsTypes";

/**
 * Activity Type JSON-LD
 */
export type ActivityTypeJsonLd =
	| ActivityStreamsTypes
	| [ActivityStreamsTypes]
	| [ActivityStreamsTypes, ...string[]];
