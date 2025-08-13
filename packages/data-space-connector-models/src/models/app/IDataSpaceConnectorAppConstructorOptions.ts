// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDataSpaceConnectorAppConfig } from "./IDataSpaceConnectorAppConfig";

/**
 * Data Space App Constructor Options.
 */
export interface IDataSpaceConnectorAppConstructorOptions {
	/**
	 * Logging component type
	 */
	loggingComponentType?: string;

	/**
	 * The configuration of the Data Space Connector App
	 */
	config: IDataSpaceConnectorAppConfig;
}
