// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDataSpaceConnectorAppDescriptor } from "@twin.org/data-space-connector-models";

/**
 * Test App Descriptor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TestAppDescriptor: IDataSpaceConnectorAppDescriptor = {
	// eslint-disable-next-line no-restricted-syntax
	id: "https://twin.example.org/app1",

	/**
	 * The module name.
	 */
	// eslint-disable-next-line no-restricted-syntax
	moduleName: "@twin.org/data-space-connector-test-app",

	// eslint-disable-next-line no-restricted-syntax
	handledTypes: {
		activityObjectTargetTriples: [{ objectType: "https://vocabulary.uncefact.org/Consignment" }]
	}
};
