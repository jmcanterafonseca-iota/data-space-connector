// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { ComponentFactory } from "@twin.org/core";
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import type { IDataSpaceConnectorApp } from "@twin.org/data-space-connector-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IActivity } from "@twin.org/standards-w3c-activity-streams";
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
	private readonly _loggingService?: ILoggingComponent;

	/**
	 * App Id.
	 * @internal
	 */
	private readonly _appId: string;

	/**
	 * Constructor options.
	 * @param options The constructor options.
	 */
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

		this._loggingService = ComponentFactory.getIfExists<ILoggingComponent>(
			options.loggingComponentType ?? "logging-service"
		);

		this._appId = options.config.dataSpaceConnectorAppId;
	}

	/**
	 * Handle Activity.
	 * @param activity Activity
	 * @returns Activity processing result
	 */
	public async handleActivity<T>(activity: IActivity): Promise<T> {
		await this._loggingService?.log({
			level: "info",
			source: this.CLASS_NAME,
			message: `App Called: ${this._appId}`
		});
		await new Promise(resolve => setTimeout(resolve, 500));
		return "1234" as T;
	}
}
