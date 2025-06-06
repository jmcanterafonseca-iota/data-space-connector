// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IDataSpaceQuery } from "../IDataSpaceQuery";

/**
 * Data Resource handler.
 */
export interface IDataResourceHandler {
	/**
	 * Handles a data resource.
	 * @param dataResourceId The Data Resource Id.
	 * @param query The Data Space query.
	 * @returns A JSON-Ld Object with the results of the query over a Data Resource.
	 */
	handleDataResource(dataResourceId: string, query?: IDataSpaceQuery): Promise<IJsonLdNodeObject>;
}
