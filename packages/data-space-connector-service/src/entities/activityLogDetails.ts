// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ActivityProcessingStatus } from "@twin.org/data-space-connector-models";
import { entity, property, SortDirection } from "@twin.org/entity";

/**
 * Activity Log Details.
 */
@entity()
export class ActivityLogDetails {
	/**
	 * The entry Id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The Activity Id.
	 */
	@property({ type: "string", optional: true })
	public activityId?: string;

	/**
	 * The processing status of the Activity.
	 */
	@property({ type: "string" })
	public status!: ActivityProcessingStatus;

	/**
	 * The generator of the Activity (different than the Actor)
	 */
	@property({ type: "string" })
	public generator!: string;

	/**
	 * The creation date.
	 */
	@property({ type: "string", format: "date-time", sortDirection: SortDirection.Descending })
	public dateCreated!: string;

	/**
	 * The last update date.
	 */
	@property({ type: "string", format: "date-time" })
	public dateUpdated!: string;
}
