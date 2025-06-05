// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IActivity } from "./IActivity";
import type { IActivityObjectTargetTriple } from "./IActivityObjectTargetTriple";
import type { IDataSpaceQuery } from "./IDataSpaceQuery";

/**
 * Interface that must be implemented by a Data Space Connector App.
 */
export interface IDataSpaceConnectorApp {
	/**
	 * A URI that denotes the identifier of the App.
	 */
	id: string;

	/**
	 * The types handled by this Data Space Connector App.
	 */
	handledTypes: {
		activityObjectTargetTriples: IActivityObjectTargetTriple[];

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
	handleActivity(activity: IActivity): Promise<unknown>;

	/**
	 * Handles a data resource.
	 * @param dataResourceId The Data Resource Id.
	 * @param query The Data Space query.
	 * @returns A JSON-Ld Object with the results of the query over a Data Resource.
	 */
	handleDataResource(dataResourceId: string, query?: IDataSpaceQuery): Promise<IJsonLdNodeObject>;
}
