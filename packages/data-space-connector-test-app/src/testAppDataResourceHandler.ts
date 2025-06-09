// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IDataResourceHandler, IDataSpaceQuery } from "@twin.org/data-space-connector-models";

/**
 * Test App Data Resource Handler
 */
export class TestAppDataResourceHandler implements IDataResourceHandler {
	/**
	 * Handle a Data Resource.
	 * @param dataResourceId Data Resource Id.
	 * @param query Query.
	 * @returns Data.
	 */
	public async handleDataResource(
		dataResourceId: string,
		query?: IDataSpaceQuery
	): Promise<IJsonLdNodeObject> {
		return {};
	}
}
