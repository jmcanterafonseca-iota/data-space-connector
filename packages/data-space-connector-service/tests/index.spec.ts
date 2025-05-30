// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { StringHelper } from "@twin.org/core";
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

// import { ActivityStreamsLdContextTypeSchema } from "@twin.org/data-space-connector-models"

let activityLogStore: MemoryEntityStorageConnector<ActivityLogEntry>;
let subscriptionStore: MemoryEntityStorageConnector<SubscriptionEntry>;

let options: IDataSpaceConnectorServiceConstructorOptions;

/*
const schemas = {
	ActivityStreamsLdContextType: ActivityStreamsLdContextTypeSchema
}
*/

describe("data-space-connector-tests", () => {
	beforeAll(async () => {
		await setupTestEnv();

		// Mock the module helper to execute the method in the same thread, so we don't have to create an engine
		ModuleHelper.execModuleMethodThread = vi
			.fn()
			.mockImplementation(async (module, method, args) =>
				ModuleHelper.execModuleMethod(module, method, args)
			);
		/*
			globalThis.fetch = vi
			.fn()
			.mockImplementation(
				async (request: Request | URL | string, opts: RequestInit | undefined) => {
					const url = new URL(extractURL(request));

					const filePath = url.pathname;
					const domainName = url.host;
					if (url.pathname.includes("data-space-connector")) {

					}
					const pathToFile = path.join(__dirname, "published-datasets", domainName, filePath);
					const contentBuffer = await fs.readFileSync(pathToFile);
					const content = contentBuffer.toString();
					return {
						status: 200,
						ok: true,
						headers: { "Content-Type": "application/json", "Content-Length": content.length },
						json: async () => new Promise(resolve => resolve(JSON.parse(content)))
					};
				}
			);
*/
		addAllContextsToDocumentCache();

		initSchema();

		options = {
			loggingConnectorType: "console",
			config: {}
		};
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

	const activity: IActivity = {
		"@context": ActivityStreamsContexts.ActivityStreamsLdContext,
		type: "Add",
		actor: {
			id: "did:iota:testnet:0x123456"
		},
		object: {
			"@context": "https://vocabulary.uncefact.org",
			"@type": "Consignment",
			globalId: "24KEP051219453I002610796"
		},
		updated: "3456"
	};

	test("It should receive an Activity in the Activity Stream", async () => {
		const dataSpaceConnectorService = new DataSpaceConnectorService(options);

		const activityLogEntryId = await dataSpaceConnectorService.notifyActivity(activity);
		expect(activityLogEntryId).toBeTypeOf("string");
	});
});
