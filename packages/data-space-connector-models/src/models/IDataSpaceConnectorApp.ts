// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IActivity } from "./IActivity";
import type { IDataSpaceQuery } from "./IDataSpaceQuery";

/**
 * Interface that must be implemented by a Data Space Connector App.
 */
export interface IDataSpaceConnectorApp {
	/**
	 * The types handled by this Data Space Connector App.
	 */
	handledTypes: {
		/**
		 * FQN of the activity types handled.
		 */
		activityTypes?: [];

		/**
		 * FQN of the activity object types handled.
		 */
		activityObjectTypes?: string[];

		/**
		 * FQN of the activity target types handled.
		 */
		activityTargetTypes?: string[];

		/**
		 * FQN of the data resource asset types handled.
		 */
		dataResourceAssetTypes?: string[];
	};

	/**
	 * Handles an Activity and report about results through the Data Space Connector Callback
	 * @param activity The Activity to be handled
	 * @returns The result of executing the Activity.
	 */
	handleActivity<T>(activity: IActivity): Promise<T>;

	/**
	 * Handles a data resource.
	 * @param dataResourceId The Data Resource Id.
	 * @param query The Data Space query.
	 * @returns A JSON-Ld Object with the results of the query over a Data Resource.
	 */
	handleDataResource(dataResourceId: string, query?: IDataSpaceQuery): Promise<IJsonLdNodeObject>;
}
