// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { DataTypeHandlerFactory } from "@twin.org/data-core";
import type { JSONSchema7 } from "json-schema";
import { ActivityStreamsContexts } from "../activityStreamsContexts";
import { ActivityStreamsTypes } from "../activityStreamsTypes";
import ActivitySchema from "../schemas/Activity.json";
import ActivityStreamsLdContextTypeSchema from "../schemas/ActivityStreamsLdContextType.json";
import ActivityTypeSchema from "../schemas/ActivityType.json";

/**
 * Data Type registration for the Data Space Connector
 */
export abstract class DataSpaceConnectorDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${ActivityStreamsContexts.ActivityStreamsNamespace}${ActivityStreamsTypes.Add}`,
			() => ({
				context: ActivityStreamsContexts.ActivityStreamsNamespace,
				type: `${ActivityStreamsTypes.Add}`,
				defaultValue: {},
				jsonSchema: async () => ActivitySchema as JSONSchema7
			})
		);

		DataTypeHandlerFactory.register(
			"https://schema.twindev.org/data-space-connector/ActivityStreamsLdContextType",
			() => ({
				context: "https://schema.twindev.org/data-space-connector/",
				type: "ActivityStreamsLdContextType",
				defaultValue: {},
				jsonSchema: async () => ActivityStreamsLdContextTypeSchema as JSONSchema7
			})
		);

		DataTypeHandlerFactory.register(
			"https://schema.twindev.org/data-space-connector/ActivityType",
			() => ({
				context: "https://schema.twindev.org/data-space-connector/",
				type: "ActivityType",
				defaultValue: {},
				jsonSchema: async () => ActivityTypeSchema as JSONSchema7
			})
		);
	}
}
