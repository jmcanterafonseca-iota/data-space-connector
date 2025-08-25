// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ISocketRequestContext, ISocketRoute } from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import type {
	IActivityLogStatusNotificationPayload,
	IActivityLogStatusRequest,
	IDataSpaceConnector
} from "@twin.org/data-space-connector-models";
import type { ILoggingConnector } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { ACTIVITY_LOG_ROUTE } from "./dataSpaceConnectorRoutes";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "dataSpaceConnectorSocketRoutes";

/**
 * The socket routes for the Data Space Connector.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateSocketRoutesDataSpaceConnector(
	baseRouteName: string,
	componentName: string
): ISocketRoute[] {
	const activityLogStatusWsRoute: ISocketRoute<
		IActivityLogStatusRequest,
		IActivityLogStatusNotificationPayload
	> = {
		operationId: "statusQuery",
		path: `${baseRouteName}/${ACTIVITY_LOG_ROUTE}/status`,
		handler: async (socketRequestContext, request, emitter) =>
			activityLogStatusUpdate(socketRequestContext, componentName, request, emitter),
		connected: async socketRequestContext => activityLogStatusConnected(socketRequestContext),
		disconnected: async socketRequestContext =>
			activityLogStatusDisconnected(socketRequestContext, componentName)
	};

	return [activityLogStatusWsRoute];
}

/**
 * Provides an status update.
 * @param socketRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @param emitter The emitter to send message back.
 * @returns The response object with additional http response properties.
 */
export async function activityLogStatusUpdate(
	socketRequestContext: ISocketRequestContext,
	componentName: string,
	request: IActivityLogStatusRequest,
	emitter: (topic: string, response: IActivityLogStatusNotificationPayload) => Promise<void>
): Promise<void> {
	Guards.object<IActivityLogStatusRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.body.operation), request.body.operation);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(request.body.subscriptionId),
		request.body.subscriptionId
	);

	const component = ComponentFactory.get<IDataSpaceConnector>(componentName);

	switch (request.body.operation) {
		case "subscribe":
			component.subscribeToActivityLog(async event => {
				await emitter("publish", {
					body: event
				});
			}, request.body.subscriptionId);
			break;
		case "unsubscribe":
			component.unSubscribeToActivityLog(request.body.subscriptionId);
			break;
	}
}

/**
 * Executes when there is a disconnection.
 * @param socketRequestContext Socket Request Context
 * @param componentName Component name.
 */
export function activityLogStatusDisconnected(
	socketRequestContext: ISocketRequestContext,
	componentName: string
): void {
	const logger = ComponentFactory.getIfExists<ILoggingConnector>(
		socketRequestContext.loggingComponentType
	);
	const component = ComponentFactory.get<IDataSpaceConnector>(componentName);

	logger?.log({
		source: ROUTES_SOURCE,
		level: "debug",
		message: "activityLogStatusDisconnected",
		data: {
			socketId: socketRequestContext.socketId
		}
	});

	component.unSubscribeToActivityLog(socketRequestContext.socketId);
}

/**
 * Executes when there is a disconnection.
 * @param socketRequestContext Socket Request Context
 */
export function activityLogStatusConnected(socketRequestContext: ISocketRequestContext): void {
	const logger = ComponentFactory.getIfExists<ILoggingConnector>(
		socketRequestContext.loggingComponentType
	);

	logger?.log({
		source: ROUTES_SOURCE,
		level: "debug",
		message: "activityLogStatusConnected",
		data: {
			socketId: socketRequestContext.socketId
		}
	});
}
