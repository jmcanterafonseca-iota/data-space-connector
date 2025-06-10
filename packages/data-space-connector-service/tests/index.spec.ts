// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import path from "node:path";
import {
	EntityStorageBackgroundTaskConnector,
	type BackgroundTask,
	initSchema as initSchemaBackgroundTask
} from "@twin.org/background-task-connector-entity-storage";
import { BackgroundTaskConnectorFactory } from "@twin.org/background-task-models";
import { Is, StringHelper } from "@twin.org/core";
import {
	ActivityProcessingStatus,
	ActivityStreamsContexts,
	type IActivity,
	type IActivityLogEntry
} from "@twin.org/data-space-connector-models";
import { TestAppDescriptor } from "@twin.org/data-space-connector-test-app";
import { FileEntityStorageConnector } from "@twin.org/entity-storage-connector-file";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";

import { ModuleHelper } from "@twin.org/modules";
import { nameof } from "@twin.org/nameof";
import { addAllContextsToDocumentCache } from "@twin.org/standards-ld-contexts";

import { cleanupTestEnv, setupTestEnv } from "./setupTestEnv";
import { DataSpaceConnectorService } from "../src/dataSpaceConnectorService";
import type { ActivityLogDetails } from "../src/entities/activityLogDetails";
import type { ActivityTask } from "../src/entities/activityTask";
import type { SubscriptionEntry } from "../src/entities/subscriptionEntry";
import type { IDataSpaceConnectorServiceConstructorOptions } from "../src/models/IDataSpaceConnectorServiceConstructorOptions";
import { initSchema } from "../src/schema";

let activityLogStore: FileEntityStorageConnector<ActivityLogDetails>;
let activityTasksStore: FileEntityStorageConnector<ActivityTask>;
let subscriptionStore: FileEntityStorageConnector<SubscriptionEntry>;

let options: IDataSpaceConnectorServiceConstructorOptions;

let backgroundTaskStorage: FileEntityStorageConnector<BackgroundTask>;
let backgroundTaskConnectorEntityStorage: EntityStorageBackgroundTaskConnector;

const BASE_STORE_DIR = "./tests/.tmp";

/**
 * Asserts Activity Log.
 * @param entry Entry to be asserted
 */
function assertActivityLog(entry: IActivityLogEntry): void {
	expect(entry.status).toBe(ActivityProcessingStatus.Completed);
	expect(entry.associatedTasks?.length).toBe(1);
	expect(entry.inErrorTasks?.length).toBe(0);
	expect(entry.finalizedTasks?.length).toBe(1);
	expect(Is.arrayValue(entry.finalizedTasks)).toBe(true);
	expect(JSON.parse((entry.finalizedTasks as { result: string }[])[0].result)).toBe("1234");
}

describe("data-space-connector-tests", () => {
	beforeAll(async () => {
		await setupTestEnv();

		// Mock the module helper to execute the method in the same thread
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
	});

	afterAll(async () => {
		await cleanupTestEnv();
	});

	beforeEach(async () => {
		activityLogStore = new FileEntityStorageConnector<ActivityLogDetails>({
			entitySchema: nameof<ActivityLogDetails>(),
			config: {
				directory: `${path.join(BASE_STORE_DIR, "/activity-log-store")}`
			}
		});
		await activityLogStore.bootstrap();

		activityTasksStore = new FileEntityStorageConnector<ActivityTask>({
			entitySchema: nameof<ActivityTask>(),
			config: {
				directory: `${path.join(BASE_STORE_DIR, "/activity-task-store")}`
			}
		});
		await activityTasksStore.bootstrap();

		subscriptionStore = new FileEntityStorageConnector<SubscriptionEntry>({
			entitySchema: nameof<SubscriptionEntry>(),
			config: {
				directory: path.join(BASE_STORE_DIR, "/subscription-store")
			}
		});
		await subscriptionStore.bootstrap();

		EntityStorageConnectorFactory.register(
			StringHelper.kebabCase(nameof<ActivityLogDetails>()),
			() => activityLogStore
		);
		EntityStorageConnectorFactory.register(
			StringHelper.kebabCase(nameof<ActivityTask>()),
			() => activityTasksStore
		);
		EntityStorageConnectorFactory.register(
			StringHelper.kebabCase(nameof<SubscriptionEntry>()),
			() => subscriptionStore
		);

		backgroundTaskStorage = new FileEntityStorageConnector<BackgroundTask>({
			entitySchema: nameof<BackgroundTask>(),
			config: { directory: `${path.join(BASE_STORE_DIR, "/background-task-store")}` }
		});
		await backgroundTaskStorage.bootstrap();
		EntityStorageConnectorFactory.register("background-task", () => backgroundTaskStorage);
		backgroundTaskConnectorEntityStorage = new EntityStorageBackgroundTaskConnector({
			backgroundTaskEntityStorageType: "background-task"
		});
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
		updated: new Date().toISOString()
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
		await backgroundTaskConnectorEntityStorage.start("");

		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		await dataSpaceConnectorService.registerDataSpaceConnectorApp(TestAppDescriptor);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(canonicalActivity);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test("It should receive an Activity in the Activity Stream - canonical LD Context Array", async () => {
		await backgroundTaskConnectorEntityStorage.start("");

		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		await dataSpaceConnectorService.registerDataSpaceConnectorApp(TestAppDescriptor);
		// Avoid duplication check
		activityLdContextArray.updated = new Date().toISOString();

		const activityLogEntryId =
			await dataSpaceConnectorService.notifyActivity(activityLdContextArray);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test.skip("It should receive an Activity in the Activity Stream - type extension", async () => {
		await backgroundTaskConnectorEntityStorage.start("");

		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		await dataSpaceConnectorService.registerDataSpaceConnectorApp(TestAppDescriptor);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(extendedActivity);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);
		assertActivityLog(entry);
	});

	test("It should not start any task if there is no registered DS Connector App", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);
		activityLdContextArray.updated = new Date().toISOString();

		const activityLogEntryId =
			await dataSpaceConnectorService.notifyActivity(activityLdContextArray);
		const entry = await dataSpaceConnectorService.getActivityLogEntry(activityLogEntryId);

		expect(entry.status).toBe(ActivityProcessingStatus.Completed);
		expect(entry.associatedTasks).toBeUndefined();
		expect(entry.finalizedTasks).toBeUndefined();
		expect(entry.inErrorTasks).toBeUndefined();
	});

	test("It should report an error if Activity is duplicated", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		await expect(dataSpaceConnectorService.notifyActivity(canonicalActivity)).rejects.toMatchObject(
			{
				name: "ConflictError",
				message: "dataSpaceConnector.activityAlreadyNotified"
			}
		);
	});
});
