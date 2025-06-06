// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { DataTypeHandlerFactory } from "@twin.org/data-core";
import type { JSONSchema7 } from "json-schema";
import { ActivityStreamsContexts } from "../models/activity-streams/activityStreamsContexts";
import { ACTIVITY_STREAMS_TYPE_LIST } from "../models/activity-streams/activityStreamsTypes";
import ActivitySchema from "../schemas/Activity.json";
import ActivityStreamsLdContextTypeSchema from "../schemas/ActivityStreamsLdContextType.json";
import ActivityTypeSchema from "../schemas/ActivityType.json";
import ActivityTypeJsonLdSchema from "../schemas/ActivityTypeJsonLd.json";

/**
 * Data Type registration for the Data Space Connector
 */
export abstract class DataSpaceConnectorDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		for (const activityStreamsType of ACTIVITY_STREAMS_TYPE_LIST) {
			DataTypeHandlerFactory.register(
				`${ActivityStreamsContexts.ActivityStreamsNamespace}${activityStreamsType}`,
				() => ({
					context: ActivityStreamsContexts.ActivityStreamsNamespace,
					type: `${activityStreamsType}`,
					defaultValue: {},
					jsonSchema: async () => ActivitySchema as JSONSchema7
				})
			);
		}

		const auxiliaryTypes: { [key: string]: JSONSchema7 } = {
			ActivityStreamsLdContextType: ActivityStreamsLdContextTypeSchema as JSONSchema7,
			ActivityType: ActivityTypeSchema as JSONSchema7,
			ActivityTypeJsonLd: ActivityTypeJsonLdSchema as JSONSchema7
		};

		for (const type of Object.keys(auxiliaryTypes)) {
			DataTypeHandlerFactory.register(
				`https://schema.twindev.org/data-space-connector/${type}`,
				() => ({
					context: "https://schema.twindev.org/data-space-connector/",
					type,
					defaultValue: {},
					jsonSchema: async () => auxiliaryTypes[type]
				})
			);
		}
	}
}
