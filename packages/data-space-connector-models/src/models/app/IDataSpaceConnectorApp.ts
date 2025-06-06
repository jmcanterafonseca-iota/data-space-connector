// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivityObjectTargetTriple } from "../IActivityObjectTargetTriple";

/**
 * Interface describes a Data Space Connector App.
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
	 * The module that implements this DS Connector App
	 */
	moduleName: string;
}
