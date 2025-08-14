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
	 * Returns an App for a (Activity, Object, Target) triple.
	 * @param activityObjectTargetTriple The triple specified FQN.
	 * @returns The Data Space Connector Apps or empty list if nothing is registered.
	 */
	public getAppForActivityObjectTargetTriple(
		activityObjectTargetTriple: IActivityQuery
	): IDataSpaceConnectorAppDescriptor[] {
		const matchingElements: IDataSpaceConnectorAppDescriptor[] = [];

		for (const handlerApp of this._activityObjectApps) {
			const appQuery = handlerApp.activityQuery;
			if (
				appQuery.objectType === activityObjectTargetTriple.objectType &&
				(Is.undefined(appQuery.activityType) ||
					appQuery.activityType === activityObjectTargetTriple.activityType) &&
				(Is.undefined(appQuery.targetType) ||
					appQuery.targetType === activityObjectTargetTriple.targetType)
			) {
				matchingElements.push(handlerApp.dataSpaceConnectorApp);
			}
		}

		return matchingElements;
	}

	/**
	 * Sets a DS Connector App to handle (Activity, Object, Target).
	 * @param activityQuery The query represented by a triple specified using Fully Qualified Name.
	 * @param dataSpaceConnectorApp The handler as a Data Space Connector App.
	 */
	public setAppForActivityObjectTargetTriple(
		activityQuery: IActivityQuery,
		dataSpaceConnectorApp: IDataSpaceConnectorAppDescriptor
	): void {
		this._activityObjectApps.push({ activityQuery, dataSpaceConnectorApp });
	}
}
