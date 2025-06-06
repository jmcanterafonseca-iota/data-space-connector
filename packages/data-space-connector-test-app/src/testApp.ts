// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type {
	IDataSpaceConnectorApp,
	IDataSpaceQuery
} from "@twin.org/data-space-connector-models";

/**
 * Test App.
 */
export class TestApp implements IDataSpaceConnectorApp {
	// eslint-disable-next-line no-restricted-syntax
	public id = "https://twin.example.org/app1";

	/**
	 * The module name.
	 */
	// eslint-disable-next-line no-restricted-syntax
	public moduleName = "@twin.org/data-space-connector-test-app";

	// eslint-disable-next-line no-restricted-syntax
	public handledTypes = {
		activityObjectTargetTriples: [{ objectType: "https://vocabulary.uncefact.org/Consignment" }]
	};

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
