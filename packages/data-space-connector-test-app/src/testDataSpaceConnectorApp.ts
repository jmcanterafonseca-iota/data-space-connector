// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { DataTypeHandlerFactory } from "@twin.org/data-core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type {
	IActivity,
	IDataSpaceConnectorApp,
	IDataSpaceQuery
} from "@twin.org/data-space-connector-models";
import { LoggingConnectorFactory, type ILoggingConnector } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { ITestAppConstructorOptions } from "./ITestAppConstructorOptions";

/**
 * Test App Activity Handler.
 */
export class TestDataSpaceConnectorApp implements IDataSpaceConnectorApp {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<TestDataSpaceConnectorApp>();

	/**
	 * Logging service.
	 * @internal
	 */
	private readonly _loggingService?: ILoggingConnector;

	/**
	 * App Id.
	 * @internal
	 */
	private readonly _appId: string;

	/**
	 * Constructor options.
	 * @param options The constructor options.
	 */
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(options: ITestAppConstructorOptions) {
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

		this._loggingService = LoggingConnectorFactory.getIfExists(
			options.loggingConnectorType ?? "logging"
		);

		this._appId = options.dataSpaceConnectorAppId;
	}

	/**
	 * Handle Activity.
	 * @param act Activity
	 * @returns Activity processing result
	 */
	public async handleActivity(act: IActivity): Promise<unknown> {
		await this._loggingService?.log({
			level: "info",
			source: this.CLASS_NAME,
			message: `App Called: ${this._appId}`
		});
		await new Promise(resolve => setTimeout(resolve, 500));
		return "1234";
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
