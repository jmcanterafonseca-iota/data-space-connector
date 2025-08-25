// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Is } from "@twin.org/core";
import type { IDataSpaceConnectorAppDescriptor } from "@twin.org/data-space-connector-models";
import {
	ActivityLogDetails,
	ActivityTask,
	initSchema
} from "@twin.org/data-space-connector-service";
import { EngineConfigHelper } from "@twin.org/engine";
import type { IEngineCore, IEngineCoreTypeConfig, IEngineServer } from "@twin.org/engine-models";
import { LoggingConnectorType, type IEngineConfig } from "@twin.org/engine-types";
import { EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { run } from "@twin.org/node-core";

const DATA_SPACE_CONNECTOR_TYPE = "data-space-connector-type";
const REST_PATH = "data-space-connector";

const filename = fileURLToPath(import.meta.url);
const dirnameStr = path.dirname(filename);

const dsConnectorAppsFileName = "data-space-connector-apps.json";
let dataSpaceConnectorAppDescriptors: IDataSpaceConnectorAppDescriptor[] = [];
const dsConnectorAppsFile = path.resolve(dsConnectorAppsFileName);
if (fs.existsSync(dsConnectorAppsFile)) {
	const jsonStr = fs.readFileSync(dsConnectorAppsFile, "utf8");
	try {
		dataSpaceConnectorAppDescriptors = JSON.parse(jsonStr) as IDataSpaceConnectorAppDescriptor[];
		if (!Is.arrayValue(dataSpaceConnectorAppDescriptors)) {
			// eslint-disable-next-line no-console
			console.warn("Data Space Connector Apps descriptors file does not represent an array");
		} else {
			// eslint-disable-next-line no-console
			console.log(`Data Space Connector Apps descriptors file  ${dsConnectorAppsFileName} read`);
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(
			`Data Space Connector Apps descriptors file ${dsConnectorAppsFileName} invalid`,
			error
		);
	}
}

// Data Space Connector Component Config
const customTypeConfig: IEngineCoreTypeConfig[] = [
	{
		type: DATA_SPACE_CONNECTOR_TYPE,
		restPath: REST_PATH,
		socketPath: REST_PATH,
		options: {
			loggingConnectorType: LoggingConnectorType.Console,
			config: {
				dataSpaceConnectorAppDescriptors
			}
		}
	}
];

await run({
	serverName: "Data Space Connector Server",
	serverVersion: "0.0.1-next.0", // x-release-please-version
	envPrefix: "DATA_SPACE_CONNECTOR_",
	localesDirectory: path.resolve("dist/locales"),
	openApiSpecFile: path.resolve("docs/open-api/spec.json"),
	extendConfig,
	extendEngine,
	extendEngineServer
});

/**
 * Extends the engine config with types specific.
 * @param engineConfig The engine configuration.
 */
export async function extendConfig(engineConfig: IEngineConfig): Promise<void> {
	initSchema();

	EngineConfigHelper.addCustomEntityStorage<ActivityLogDetails>(
		engineConfig,
		nameof<ActivityLogDetails>(),
		EntitySchemaHelper.getSchema(ActivityLogDetails)
	);

	EngineConfigHelper.addCustomEntityStorage<ActivityTask>(
		engineConfig,
		nameof<ActivityTask>(),
		EntitySchemaHelper.getSchema(ActivityTask)
	);
}

/**
 * Extends the engine.
 * @param engineCore Engine Core
 */
export async function extendEngine(engineCore: IEngineCore): Promise<void> {
	engineCore.addTypeInitialiser(
		DATA_SPACE_CONNECTOR_TYPE,
		customTypeConfig,
		`file://${path.join(dirnameStr, "dataSpaceConnector.js")}`,
		"dataSpaceConnectorTypeInitialiser"
	);
}

/**
 * Extends the engine server.
 * @param server The engine server.
 */
export async function extendEngineServer(server: IEngineServer): Promise<void> {
	server.addRestRouteGenerator(
		DATA_SPACE_CONNECTOR_TYPE,
		customTypeConfig,
		`file://${path.join(dirnameStr, "dataSpaceConnector.js")}`,
		"generateRestRoutes"
	);

	server.addSocketRouteGenerator(
		DATA_SPACE_CONNECTOR_TYPE,
		customTypeConfig,
		`file://${path.join(dirnameStr, "dataSpaceConnector.js")}`,
		"generateSocketRoutes"
	);
}
