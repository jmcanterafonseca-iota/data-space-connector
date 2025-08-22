// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { Is } from "@twin.org/core";
import type {
	IActivityQuery,
	IDataSpaceConnectorAppDescriptor
} from "@twin.org/data-space-connector-models";

/**
 * DS Connector Registry
 */
export class AppRegistry {
	/**
	 * Object Handlers
	 * @internal
	 */
	private readonly _activityObjectApps: {
		activityQuery: IActivityQuery;
		dataSpaceConnectorApp: IDataSpaceConnectorAppDescriptor;
	}[];

	/**
	 * Constructor.
	 */
	constructor() {
		this._activityObjectApps = [];
	}

	/**
	 * Returns an App for a (Activity, Object, Target).
	 * @param activityQuery The (Activity, Object, Target) query specified using a FQN.
	 * @returns The Data Space Connector Apps or empty list if nothing is registered.
	 */
	public getAppForActivityQuery(activityQuery: IActivityQuery): IDataSpaceConnectorAppDescriptor[] {
		const matchingElements: IDataSpaceConnectorAppDescriptor[] = [];

		for (const handlerApp of this._activityObjectApps) {
			const appQuery = handlerApp.activityQuery;
			if (
				appQuery.objectType === activityQuery.objectType &&
				(Is.undefined(appQuery.activityType) ||
					appQuery.activityType === activityQuery.activityType) &&
				(Is.undefined(appQuery.targetType) || appQuery.targetType === activityQuery.targetType)
			) {
				matchingElements.push(handlerApp.dataSpaceConnectorApp);
			}
		}

		return matchingElements;
	}

	/**
	 * Sets a DS Connector App to handle (Activity, Object, Target).
	 * @param activityQuery The query (Activity, Object, Target) represented using Fully Qualified Name.
	 * @param dataSpaceConnectorApp The handler as a Data Space Connector App.
	 */
	public setAppForActivityQuery(
		activityQuery: IActivityQuery,
		dataSpaceConnectorApp: IDataSpaceConnectorAppDescriptor
	): void {
		this._activityObjectApps.push({ activityQuery, dataSpaceConnectorApp });
	}
}
