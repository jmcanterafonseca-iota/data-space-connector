// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { ActivityStreamsContexts, type IActivity } from "@twin.org/data-space-connector-models";

export const canonicalActivity: IActivity = {
	"@context": ActivityStreamsContexts.ActivityStreamsLdContext,
	type: "Create",
	actor: {
		id: "did:iota:testnet:0x123456"
	},
	object: {
		"@context": "https://vocabulary.uncefact.org/unece-context-D23B.jsonld",
		"@type": "Consignment",
		globalId: "24KEP051219453I002610796"
	},
	updated: new Date().toISOString()
};

export const activityLdContextArray: IActivity = {
	...canonicalActivity,
	"@context": [ActivityStreamsContexts.ActivityStreamsLdContext]
};

export const extendedActivity: IActivity = {
	"@context": [
		{
			MyCreate: "https://twin.example.org/MyCreate"
		},
		ActivityStreamsContexts.ActivityStreamsLdContext
	],
	type: ["Create", "MyCreate"],
	actor: {
		id: "did:iota:testnet:0x123456"
	},
	object: {
		"@context": "https://vocabulary.uncefact.org/unece-context-D23B.jsonld",
		"@type": "Consignment",
		globalId: "24KEP051219453I002610796"
	},
	updated: "02-06-2025T12:00:00Z"
};
