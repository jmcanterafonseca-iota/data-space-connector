// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import type {
	ActivityProcessingStatus,
	IActivityTask
} from "@twin.org/data-space-connector-models";
import { entity, property, SortDirection } from "@twin.org/entity";

/**
 * Activity Log Entry.
 */
@entity()
export class ActivityLogEntry {
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
	 * The status
	 */
	@property({ type: "string" })
	public status!: ActivityProcessingStatus;

	/**
	 * The generator of the activity
	 */
	@property({ type: "string" })
	public generator!: string;

	/**
	 * The creation date.
	 */
	@property({ type: "string", format: "date-time", sortDirection: SortDirection.Descending })
	public dateCreated!: string;

	/**
	 * The update date.
	 */
	@property({ type: "string", format: "date-time" })
	public dateUpdated!: string;

	/**
	 * The associated tasks
	 */
	@property({ type: "array", format: "json" })
	public associatedTasks!: IActivityTask[];

	/**
	 * The finalized tasks
	 */
	@property({ type: "array", format: "json" })
	public finalizedTasks!: (IActivityTask & { result: string })[];

	/**
	 * The in error tasks.
	 */
	@property({ type: "array", format: "json" })
	public inErrorTasks!: (IActivityTask & { error: IError })[];
}
