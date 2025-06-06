// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The types concerning Activity Streams.
 * @see https://www.w3.org/ns/activitystreams
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ActivityStreamsTypes = {
	/**
	 * Activity base class
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-activity
	 */
	Activity: "Activity",

	/**
	 * Activity Create
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create
	 */
	Create: "Create",

	/**
	 * Activity Add
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-add
	 */
	Add: "Add",

	/**
	 * Activity Update
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-update
	 */
	Update: "Update",

	/**
	 * Activity Remove
	 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-remove
	 */
	Remove: "Remove",

	/**
	 * Activity Delete
	 */
	Delete: "Delete"
} as const;

export const ACTIVITY_STREAMS_TYPE_LIST = [
	ActivityStreamsTypes.Activity,
	ActivityStreamsTypes.Create,
	ActivityStreamsTypes.Add,
	ActivityStreamsTypes.Update,
	ActivityStreamsTypes.Remove,
	ActivityStreamsTypes.Delete
];

/**
 * The types concerning Activity.
 */
export type ActivityStreamsTypes = (typeof ActivityStreamsTypes)[keyof typeof ActivityStreamsTypes];
