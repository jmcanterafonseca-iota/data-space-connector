// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDataSpaceConnectorApp } from "@twin.org/data-space-connector-models";

/**
 * Handler Registry
 */
export class HandlerRegistry {
	/**
	 * Object Handlers
	 * @internal
	 */
	private readonly _activityObjectHandlers: {
		[activityObjectType: string]: IDataSpaceConnectorApp;
	};

	/**
	 * Constructor.
	 */
	constructor() {
		this._activityObjectHandlers = {};
	}

	/**
	 * Returns a handler for an object type.
	 * @param activityObjectType The object type expressed as a Fully Qualified Name.
	 * @returns The Data Space Connector App or undefined if nothing is registered.
	 */
	public getHandlerForActivityObjectType(
		activityObjectType: string
	): IDataSpaceConnectorApp | undefined {
		return this._activityObjectHandlers[activityObjectType];
	}

	/**
	 * Sets a handler for an object type. Overwrites if one is already registered.
	 * @param activityObjectType The object type expressed as a Fully Qualified Name.
	 * @param handler The handler as a Data Space Connector App.
	 */
	public setHandlerForActivityObjectType(
		activityObjectType: string,
		handler: IDataSpaceConnectorApp
	): void {
		this._activityObjectHandlers[activityObjectType] = handler;
	}
}
