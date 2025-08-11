// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDataSpaceConnectorAppDescriptor } from "@twin.org/data-space-connector-models";

/**
 * Data Space Connector service configuration
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDataSpaceConnectorServiceConfig {
	/**
	 * Data Space Connector App Descriptors to be registered initially
	 */
	dataSpaceConnectorAppDescriptors?: IDataSpaceConnectorAppDescriptor[];
}
