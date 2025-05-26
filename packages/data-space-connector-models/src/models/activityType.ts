// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ActivityStreamsTypes } from "../activityStreamsTypes";

/**
 * Activity Type.
 *
 */
export type ActivityType =
	| typeof ActivityStreamsTypes.Activity
	| typeof ActivityStreamsTypes.Add
	| typeof ActivityStreamsTypes.Create
	| typeof ActivityStreamsTypes.Update
	| typeof ActivityStreamsTypes.Remove
	| typeof ActivityStreamsTypes.Delete;
