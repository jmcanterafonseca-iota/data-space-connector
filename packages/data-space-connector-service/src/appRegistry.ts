// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { Is } from "@twin.org/core";
import type {
	IActivityObjectTargetTriple,
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
		activityObjectTargetTriple: IActivityObjectTargetTriple;
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
		activityObjectTargetTriple: IActivityObjectTargetTriple
	): IDataSpaceConnectorAppDescriptor[] {
		const matchingElements: IDataSpaceConnectorAppDescriptor[] = [];

		for (const handlerApp of this._activityObjectApps) {
			const appTriple = handlerApp.activityObjectTargetTriple;
			if (
				appTriple.objectType === activityObjectTargetTriple.objectType &&
				(Is.undefined(appTriple.activityType) ||
					appTriple.activityType === activityObjectTargetTriple.activityType) &&
				(Is.undefined(appTriple.targetType) ||
					appTriple.targetType === activityObjectTargetTriple.targetType)
			) {
				matchingElements.push(handlerApp.dataSpaceConnectorApp);
			}
		}

		return matchingElements;
	}

	/**
	 * Sets a DS Connector App to handle (Activity, Object, Target).
	 * @param activityObjectTargetTriple The triple specified using Fully Qualified Name.
	 * @param dataSpaceConnectorApp The handler as a Data Space Connector App.
	 */
	public setAppForActivityObjectTargetTriple(
		activityObjectTargetTriple: IActivityObjectTargetTriple,
		dataSpaceConnectorApp: IDataSpaceConnectorAppDescriptor
	): void {
		this._activityObjectApps.push({ activityObjectTargetTriple, dataSpaceConnectorApp });
	}
}
