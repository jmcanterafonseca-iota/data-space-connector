// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDataSpaceConnectorServiceConfig } from "./IDataSpaceConnectorServiceConfig";

/**
 * Federated Catalogue service options
 */
export interface IDataSpaceConnectorServiceConstructorOptions {
	/**
	 * The identity resolver component used.
	 */
	identityResolverComponentType?: string;

	/**
	 * Logging component type
	 */
	loggingComponentType?: string;

	/**
	 * The configuration of the Federated Catalogue service.
	 */
	config: IDataSpaceConnectorServiceConfig;

	/**
	 * The entity storage for activity log details.
	 * @default activity-log-details
	 */
	activityLogEntityStorageType?: string;

	/**
	 * The entity storage for the association between Activities and Tasks.
	 * @default activity-task
	 */
	activityTaskEntityStorageType?: string;

	/**
	 * The entity storage for subscriptions.
	 * @default subscription-entry
	 */
	subscriptionEntityStorageType?: string;

	/**
	 * Background task connector.
	 * @default background-task-4-data-space-connector
	 */
	backgroundTaskConnectorType?: string;
}
