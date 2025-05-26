// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdContextDefinitionElement } from "@twin.org/data-json-ld";

/**
 * A subscription.
 */
export interface ISubscription {
	/**
	 * The LD Context.
	 */
	"@context": IJsonLdContextDefinitionElement;
}
