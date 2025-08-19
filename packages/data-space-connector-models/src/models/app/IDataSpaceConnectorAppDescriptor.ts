// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IActivityQuery } from "../IActivityQuery";

/**
 * Interface describes a Data Space Connector App.
 */
export interface IDataSpaceConnectorAppDescriptor {
	/**
	 * A URI that denotes the identifier of the App.
	 */
	id: string;

	/**
	 * The activities handled by this Data Space Connector App.
	 */
	activitiesHandled: IActivityQuery[];

	/**
	 * The module that implements this DS Connector App
	 */
	moduleName: string;

	/**
	 * The function that allows the initialisation of this DS Connector App
	 * @default "appInitialiser"
	 */
	initialiserName?: string;
}
