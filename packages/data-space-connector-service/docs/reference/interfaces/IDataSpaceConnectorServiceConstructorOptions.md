# Interface: IDataSpaceConnectorServiceConstructorOptions

Federated Catalogue service options

## Properties

### identityResolverComponentType?

> `optional` **identityResolverComponentType**: `string`

The identity resolver component used.

***

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

Logging component type

***

### config

> **config**: [`IDataSpaceConnectorServiceConfig`](IDataSpaceConnectorServiceConfig.md)

The configuration of the Data Space Connector Service.

***

### activityLogEntityStorageType?

> `optional` **activityLogEntityStorageType**: `string`

The entity storage for activity log details.

#### Default

```ts
activity-log-details
```

***

### activityTaskEntityStorageType?

> `optional` **activityTaskEntityStorageType**: `string`

The entity storage for the association between Activities and Tasks.

#### Default

```ts
activity-task
```

***

### backgroundTaskConnectorType?

> `optional` **backgroundTaskConnectorType**: `string`

Background task connector.

#### Default

```ts
background-task-service
```
