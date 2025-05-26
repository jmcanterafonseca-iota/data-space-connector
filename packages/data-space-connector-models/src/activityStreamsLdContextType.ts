// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdContextDefinitionElement } from "@twin.org/data-json-ld";
import type { ActivityStreamsContexts } from "./activityStreamsContexts";

/**
 * The Activity Streams JSON-LD context type.
 */
export type ActivityStreamsLdContextType =
	| typeof ActivityStreamsContexts.ActivityStreamsLdContext
	| [
			...IJsonLdContextDefinitionElement[],
			typeof ActivityStreamsContexts.ActivityStreamsLdContext,
			IJsonLdContextDefinitionElement
	  ]
	| [
			IJsonLdContextDefinitionElement,
			typeof ActivityStreamsContexts.ActivityStreamsLdContext,
			...IJsonLdContextDefinitionElement[]
	  ];
