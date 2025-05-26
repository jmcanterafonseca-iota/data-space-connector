// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivityLogEntry, ISubscriptionEntry } from "@twin.org/data-space-connector-models";
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { ActivityLogEntry } from "./entities/activityLogEntry";
import { SubscriptionEntry } from "./entities/subscriptionEntry";

/**
 * Inits schemas.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<IActivityLogEntry>(), () =>
		EntitySchemaHelper.getSchema(ActivityLogEntry)
	);

	EntitySchemaFactory.register(nameof<ISubscriptionEntry>(), () =>
		EntitySchemaHelper.getSchema(SubscriptionEntry)
	);
}
