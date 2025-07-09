// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	ICreatedResponse,
	IHttpRequestContext,
	INotFoundResponse,
	IRestRoute,
	ISocketRoute,
	ITag,
	IUnprocessableEntityResponse
} from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import {
	ActivityStreamsContexts,
	type IDataSpaceConnector,
	type IActivity,
	type IActivityLogEntryGetRequest,
	type IActivityLogEntryGetResponse,
	type IActivityStreamRequest,
	type IActivityLogEntry,
	type ISubscriptionCreateRequest,
	type ISubscription,
	type IActivityLogStatusRequest,
	type IActivityLogStatusNotificationPayload
} from "@twin.org/data-space-connector-models";
import { nameof } from "@twin.org/nameof";
import { HttpStatusCode, MimeTypes } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "dataSpaceConnectorRoutes";

/**
 * Activity stream route.
 */
const ACTIVITY_STREAM_ROUTE = "notify";

/**
 * Activity processing details route.
 */
const ACTIVITY_LOG_ROUTE = "activity-logs";

/**
 * Data Resource route.
 */
// const DATA_RESOURCE_ROUTE = "data";

/**
 * Data Space Connector route.
 */
const SUBSCRIPTIONS_ROUTE = "subscriptions";

/**
 * The tag to associate with the routes.
 */
export const tagsDataSpaceConnector: ITag[] = [
	{
		name: "Data Space Connector",
		description: "Endpoints to access a Data Space Connector."
	}
];

const activityExample: IActivity = {
	"@context": ActivityStreamsContexts.ActivityStreamsLdContext,
	type: "Add",
	actor: {
		id: "did:iota:testnet:0x123456"
	},
	object: {
		"@context": "https://vocabulary.uncefact.org",
		"@type": "Consignment",
		globalId: "24KEP051219453I002610796"
	},
	updated: new Date().toISOString()
};

const activityLogEntryExample: IActivityLogEntry = {
	id: "urn:x-activity-log:134567",
	dateCreated: new Date().toISOString(),
	dateUpdated: new Date().toISOString(),
	generator: "did:iota:testnet:123456",
	status: "pending",
	pendingTasks: [
		{
			taskId: "urn:x-task-id:45678",
			dataSpaceConnectorAppId: "https://my-app.example.org/app1"
		}
	],
	runningTasks: [],
	finalizedTasks: [],
	inErrorTasks: []
};

const subscriptionExample: ISubscription = {
	"@context": "https://example.org"
};

/**
 * The REST routes for Federated Catalogue.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param factoryServiceName The name of the service to use in the routes store in the ServiceFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesDataSpaceConnector(
	baseRouteName: string,
	factoryServiceName: string
): IRestRoute[] {
	const notifyActivityStreamRoute: IRestRoute<IActivityStreamRequest, ICreatedResponse> = {
		operationId: "activityStreamNotify",
		summary: "Notify of a new Activity",
		tag: tagsDataSpaceConnector[0].name,
		method: "POST",
		path: `${baseRouteName}/${ACTIVITY_STREAM_ROUTE}`,
		handler: async (httpRequestContext, request) =>
			activityStreamNotify(baseRouteName, httpRequestContext, factoryServiceName, request),
		requestType: {
			mimeType: MimeTypes.JsonLd,
			type: nameof<IActivityStreamRequest>(),
			examples: [
				{
					id: "activityStreamExample",
					request: {
						body: activityExample
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>()
			},
			{ type: nameof<IUnprocessableEntityResponse>() }
		]
	};

	const createSubscriptionRoute: IRestRoute<ISubscriptionCreateRequest, ICreatedResponse> = {
		operationId: "subscriptionCreate",
		summary: "Create a new Subscription",
		tag: tagsDataSpaceConnector[0].name,
		method: "POST",
		path: `${baseRouteName}/${SUBSCRIPTIONS_ROUTE}`,
		handler: async (httpRequestContext, request) =>
			subscriptionCreate(baseRouteName, httpRequestContext, factoryServiceName, request),
		requestType: {
			mimeType: MimeTypes.JsonLd,
			type: nameof<ISubscriptionCreateRequest>(),
			examples: [
				{
					id: "subscriptionExample",
					request: {
						body: subscriptionExample
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>()
			},
			{ type: nameof<IUnprocessableEntityResponse>() }
		]
	};

	const getActivityLogEntryRoute: IRestRoute<
		IActivityLogEntryGetRequest,
		IActivityLogEntryGetResponse | INotFoundResponse
	> = {
		operationId: "dataSpaceConnectorGetActivityLogEntry",
		summary: "Get a Activity Log Entry",
		tag: tagsDataSpaceConnector[0].name,
		method: "GET",
		path: `${baseRouteName}/${ACTIVITY_LOG_ROUTE}/:id`,
		handler: async (httpRequestContext, request) =>
			activityLogEntryGet(httpRequestContext, factoryServiceName, request),
		requestType: {
			type: nameof<IActivityLogEntryGetRequest>(),
			examples: [
				{
					id: "activityLogEntryGet",
					request: {
						pathParams: {
							id: "urn:x-activity-log:1234567"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IActivityLogEntryGetResponse>(),
				examples: [
					{
						id: "activityLogEntryResponseExample",
						response: {
							body: { ...activityLogEntryExample }
						}
					}
				]
			}
		]
	};

	return [notifyActivityStreamRoute, getActivityLogEntryRoute, createSubscriptionRoute];
}

/**
 * Notify a new Activity to the Data Space Connector Activity Stream.
 * @param baseRouteName The base route name.
 * @param httpRequestContext The request context for the API.
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function activityStreamNotify(
	baseRouteName: string,
	httpRequestContext: IHttpRequestContext,
	factoryServiceName: string,
	request: IActivityStreamRequest
): Promise<ICreatedResponse> {
	Guards.object<IActivityStreamRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IActivity>(ROUTES_SOURCE, nameof(request.body), request.body);

	const service = ComponentFactory.get<IDataSpaceConnector>(factoryServiceName);
	const activityLogEntryId = await service.notifyActivity(request.body);

	return {
		headers: {
			location: `${baseRouteName}/${ACTIVITY_LOG_ROUTE}/${activityLogEntryId}`
		},
		statusCode: HttpStatusCode.created
	};
}

/**
 * Get an Activity Log entry.
 * @param httpRequestContext The request context for the API.
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function activityLogEntryGet(
	httpRequestContext: IHttpRequestContext,
	factoryServiceName: string,
	request: IActivityLogEntryGetRequest
): Promise<IActivityLogEntryGetResponse | INotFoundResponse> {
	const service = ComponentFactory.get<IDataSpaceConnector>(factoryServiceName);

	const id = request?.pathParams.id;
	Guards.stringValue(ROUTES_SOURCE, nameof(id), id);

	return {
		body: await service.getActivityLogEntry(id)
	};
}

/**
 * Notify a new Activity to the Data Space Connector Activity Stream.
 * @param baseRouteName The base route name.
 * @param httpRequestContext The request context for the API.
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function subscriptionCreate(
	baseRouteName: string,
	httpRequestContext: IHttpRequestContext,
	factoryServiceName: string,
	request: ISubscriptionCreateRequest
): Promise<ICreatedResponse> {
	Guards.object<ISubscriptionCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.body), request.body);

	const service = ComponentFactory.get<IDataSpaceConnector>(factoryServiceName);
	const subscriptionId = await service.subscribe(request.body);

	return {
		headers: {
			location: `${baseRouteName}/${ACTIVITY_LOG_ROUTE}/${subscriptionId}`
		},
		statusCode: HttpStatusCode.created
	};
}

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
		handler: async (httpRequestContext, request, emitter) =>
			statusUpdate(httpRequestContext, componentName, request, emitter)
	};

	return [activityLogStatusWsRoute];
}

/**
 * Provides an status update.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @param emitter The emitter to send message back.
 * @returns The response object with additional http response properties.
 */
export async function statusUpdate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IActivityLogStatusRequest,
	emitter: (topic: string, response: IActivityLogStatusNotificationPayload) => Promise<void>
): Promise<void> {
	Guards.stringValue(ROUTES_SOURCE, nameof(request.body.topic), request.body.topic);

	const component = ComponentFactory.get<IDataSpaceConnector>(componentName);
	await component.subscribeToActivityLog(async event => {
		await emitter("publish", {
			body: event
		});
	});
}
