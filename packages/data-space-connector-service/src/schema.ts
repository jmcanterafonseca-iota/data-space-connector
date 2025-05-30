// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { ActivityLogEntry } from "./entities/activityLogEntry";
import { SubscriptionEntry } from "./entities/subscriptionEntry";

/**
 * Inits schemas.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<ActivityLogEntry>(), () =>
		EntitySchemaHelper.getSchema(ActivityLogEntry)
	);

	EntitySchemaFactory.register(nameof<SubscriptionEntry>(), () =>
		EntitySchemaHelper.getSchema(SubscriptionEntry)
	);
}
