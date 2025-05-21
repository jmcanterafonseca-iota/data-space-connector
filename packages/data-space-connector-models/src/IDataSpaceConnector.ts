// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdDocument } from "@twin.org/data-json-ld";
import type { IActivity } from "./models/IActivity";
import type { ISubscription } from "./models/ISubscription";

/**
 * Data Space Connector service interface
 */
export interface IDataSpaceConnector {
	/**
	 * Notify an Activity.
	 * @param activity The Activity notified.
	 * @returns void
	 */
	notify(activity: IActivity): Promise<void>;

	/**
	 * Subscribe to the Data Space Connector.
	 * @param subscription The subscription
	 * @returns void
	 */
	subscribe(subscription: ISubscription): Promise<void>;

	/**
	 * Gets data associated with a Service Offering.
	 * @param serviceOfferingId The Service Offering Id as registered on the Fed Catalogue.
	 * @returns a JSON-LD document with the data
	 */
	getData(serviceOfferingId: string): Promise<IJsonLdDocument>;
}
