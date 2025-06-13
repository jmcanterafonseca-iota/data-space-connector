// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRoute, ISocketRoute } from "@twin.org/api-models";
import { ComponentFactory, StringHelper } from "@twin.org/core";
import type { IDataSpaceConnector } from "@twin.org/data-space-connector-models";
import {
	DataSpaceConnectorService,
	generateRestRoutesDataSpaceConnector,
	generateSocketRoutesDataSpaceConnector,
	type IDataSpaceConnectorServiceConstructorOptions
} from "@twin.org/data-space-connector-service";
import type { IEngineCore, IEngineCoreContext } from "@twin.org/engine-models";
import { nameof } from "@twin.org/nameof";

/**
 * Data Space Connector initialiser.
 * @param core The engine core.
 * @param context The context for the engine.
 * @param instanceConfig The instance config.
 * @param instanceConfig.options The instance config options.
 * @param overrideInstanceType The instance type to override the default.
 * @returns The name of the instance created.
 */
export function dataSpaceConnectorTypeInitialiser(
	core: IEngineCore,
	context: IEngineCoreContext,
	instanceConfig: { options: IDataSpaceConnectorServiceConstructorOptions },
	overrideInstanceType: string
): string {
	const componentName = StringHelper.kebabCase(nameof<IDataSpaceConnector>(), true);
	ComponentFactory.register(
		componentName,
		() => new DataSpaceConnectorService(instanceConfig.options)
	);
	return overrideInstanceType ?? componentName;
}

/**
 * Generate the rest routes for the component.
 * @param baseRouteName The base route name.
 * @param componentName The component name.
 * @returns The rest routes.
 */
export function generateRestRoutes(baseRouteName: string, componentName: string): IRestRoute[] {
	return generateRestRoutesDataSpaceConnector(baseRouteName, componentName);
}

/**
 * Generate the socket routes for the component.
 * @param baseRouteName The base route name.
 * @param componentName The component name.
 * @returns The rest routes.
 */
export function generateSocketRoutes(baseRouteName: string, componentName: string): ISocketRoute[] {
	return generateSocketRoutesDataSpaceConnector(baseRouteName, componentName);
}
