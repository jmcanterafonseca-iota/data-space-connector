// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ISocketRouteEntryPoint } from "@twin.org/api-models";
import { tagsDataSpaceConnector } from "./dataSpaceConnectorRoutes";
import { generateSocketRoutesDataSpaceConnector } from "./dataSpaceConnectorSocketRoutes";

export const socketEntryPoints: ISocketRouteEntryPoint[] = [
	{
		name: "data-space-connector",
		defaultBaseRoute: "data-space-connector",
		tags: tagsDataSpaceConnector,
		generateRoutes: generateSocketRoutesDataSpaceConnector
	}
];
