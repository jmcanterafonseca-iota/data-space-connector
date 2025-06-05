// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import {
	EntityStorageBackgroundTaskConnector,
	type BackgroundTask,
	initSchema as initSchemaBackgroundTask
} from "@twin.org/background-task-connector-entity-storage";
import { BackgroundTaskConnectorFactory } from "@twin.org/background-task-models";
import { StringHelper } from "@twin.org/core";
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import {
	ActivityProcessingStatus,
	ActivityStreamsContexts,
	type IDataSpaceConnectorApp,
	type IDataSpaceQuery,
	type IActivity,
	type IActivityLogEntry
} from "@twin.org/data-space-connector-models";
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

let backgroundTaskStorage: MemoryEntityStorageConnector<BackgroundTask>;
let backgroundTaskConnectorEntityStorage: EntityStorageBackgroundTaskConnector;

/**
 * Asserts Activity Log.
 * @param entry Entry to be asserted
 */
function assertActivityLog(entry: IActivityLogEntry): void {
	expect(entry.status).toBe(ActivityProcessingStatus.Pending);
	expect(entry.associatedTasks.length).toBe(1);
}

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
		initSchemaBackgroundTask();

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

		backgroundTaskStorage = new MemoryEntityStorageConnector<BackgroundTask>({
			entitySchema: nameof<BackgroundTask>()
		});
		EntityStorageConnectorFactory.register("background-task", () => backgroundTaskStorage);

		backgroundTaskConnectorEntityStorage = new EntityStorageBackgroundTaskConnector();
		BackgroundTaskConnectorFactory.register(
			"background-task-4-data-space",
			() => backgroundTaskConnectorEntityStorage
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

	/**
	 * Test App.
	 */
	class TestApp implements IDataSpaceConnectorApp {
		// eslint-disable-next-line no-restricted-syntax
		public id = "https://twn.example.org/app1";

		// eslint-disable-next-line no-restricted-syntax
		public handledTypes = {
			activityObjectTargetTriples: [{ objectType: "https://vocabulary.uncefact.org/Consignment" }]
		};

		/**
		 * Handle Activity.
		 * @param act Activity
		 * @returns Activity processing result
		 */
		public async handleActivity(act: IActivity): Promise<unknown> {
			return "hello";
		}

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

	test("It should receive an Activity in the Activity Stream - canonical", async () => {
		await backgroundTaskConnectorEntityStorage.start("");

		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		const testApp = new TestApp();
		dataSpaceConnectorService.registerDataSpaceConnectorApp(testApp);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(canonicalActivity);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test("It should receive an Activity in the Activity Stream - canonical LD Context Array", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		const testApp = new TestApp();
		dataSpaceConnectorService.registerDataSpaceConnectorApp(testApp);

		const activityLogEntryId =
			await dataSpaceConnectorService.notifyActivity(activityLdContextArray);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test("It should receive an Activity in the Activity Stream - type extension", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		const testApp = new TestApp();
		dataSpaceConnectorService.registerDataSpaceConnectorApp(testApp);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(extendedActivity);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test("It should not start any task if there is no registered DS Connector App", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId =
			await dataSpaceConnectorService.notifyActivity(activityLdContextArray);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);

		expect(entry.status).toBe(ActivityProcessingStatus.Completed);
		expect(entry.associatedTasks.length).toBe(0);
	});

	test("It should report an error if Activity is duplicated", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(canonicalActivity);

		await expect(dataSpaceConnectorService.notifyActivity(canonicalActivity)).rejects.toMatchObject(
			{
				name: "ConflictError",
				message: "dataSpaceConnector.activityAlreadyNotified",
				properties: { conflictId: activityLogEntryId }
			}
		);
	});
});
