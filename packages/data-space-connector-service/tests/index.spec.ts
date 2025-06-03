// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { StringHelper } from "@twin.org/core";
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { ActivityStreamsContexts, type IActivity } from "@twin.org/data-space-connector-models";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";

import { ModuleHelper } from "@twin.org/modules";
import { nameof } from "@twin.org/nameof";
import { addAllContextsToDocumentCache } from "@twin.org/standards-ld-contexts";

import { cleanupTestEnv, setupTestEnv } from "./setupTestEnv";
import { DataSpaceConnectorService } from "../src/dataSpaceConnectorService";
import type { ActivityLogEntry } from "../src/entities/activityLogEntry";
import type { SubscriptionEntry } from "../src/entities/subscriptionEntry";
import type { IDataSpaceConnectorServiceConstructorOptions } from "../src/models/IDataSpaceConnectorServiceConstructorOptions";
import { initSchema } from "../src/schema";

let activityLogStore: MemoryEntityStorageConnector<ActivityLogEntry>;
let subscriptionStore: MemoryEntityStorageConnector<SubscriptionEntry>;

let options: IDataSpaceConnectorServiceConstructorOptions;

describe("data-space-connector-tests", () => {
	beforeAll(async () => {
		await setupTestEnv();

		// Mock the module helper to execute the method in the same thread, so we don't have to create an engine
		ModuleHelper.execModuleMethodThread = vi
			.fn()
			.mockImplementation(async (module, method, args) =>
				ModuleHelper.execModuleMethod(module, method, args)
			);

		addAllContextsToDocumentCache();

		initSchema();

		options = {
			loggingConnectorType: "console",
			config: {}
		};

		DataTypeHandlerFactory.register("https://twin.example.org/MyCreate", () => ({
			context: "https://twin.example.org/",
			type: "MyCreate",
			defaultValue: {},
			jsonSchema: async () => ({
				type: "object"
			})
		}));

		DataTypeHandlerFactory.register("https://vocabulary.uncefact.org/Consignment", () => ({
			context: "https://vocabulary.uncefact.org/",
			type: "Consignment",
			defaultValue: {},
			jsonSchema: async () => ({
				type: "object"
			})
		}));
	});

	afterAll(async () => {
		await cleanupTestEnv();
	});

	beforeEach(async () => {
		activityLogStore = new MemoryEntityStorageConnector<ActivityLogEntry>({
			entitySchema: nameof<ActivityLogEntry>()
		});

		subscriptionStore = new MemoryEntityStorageConnector<SubscriptionEntry>({
			entitySchema: nameof<SubscriptionEntry>()
		});

		EntityStorageConnectorFactory.register(
			StringHelper.kebabCase(nameof<ActivityLogEntry>()),
			() => activityLogStore
		);
		EntityStorageConnectorFactory.register(
			StringHelper.kebabCase(nameof<SubscriptionEntry>()),
			() => subscriptionStore
		);
	});

	const canonicalActivity: IActivity = {
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
		updated: "02-06-2025T12:00:00Z"
	};

	const activityLdContextArray: IActivity = {
		...canonicalActivity,
		"@context": [ActivityStreamsContexts.ActivityStreamsLdContext]
	};

	const extendedActivity: IActivity = {
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

	test("It should receive an Activity in the Activity Stream - canonical", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(canonicalActivity);
		expect(activityLogEntryId).toBeTypeOf("string");
	});

	test("It should receive an Activity in the Activity Stream - canonical LD Context Array", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId =
			await dataSpaceConnectorService.notifyActivity(activityLdContextArray);
		expect(activityLogEntryId).toBeTypeOf("string");
	});

	test("It should receive an Activity in the Activity Stream - type extension", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(extendedActivity);
		expect(activityLogEntryId).toBeTypeOf("string");
	});
});
