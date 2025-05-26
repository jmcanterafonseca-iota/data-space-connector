// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import {
	generateRestRoutesDataSpaceConnector,
	tagsDataSpaceConnector
} from "./dataSpaceConnectorRoutes";

export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "data-space-connector",
		defaultBaseRoute: "data-space-connector",
		tags: tagsDataSpaceConnector,
		generateRoutes: generateRestRoutesDataSpaceConnector
	}
];
