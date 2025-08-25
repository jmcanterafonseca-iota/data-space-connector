// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataSpaceConnectorSocketClientConfig } from "./IDataSpaceConnectorSocketClientConfig";

/**
 * The options for the data space connector socket client.
 */
export interface IDataSpaceConnectorSocketClientConstructorOptions {
	/**
	 * The type of logging component to use.
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the data space connector socket client.
	 */
	config: IDataSpaceConnectorSocketClientConfig;
}
