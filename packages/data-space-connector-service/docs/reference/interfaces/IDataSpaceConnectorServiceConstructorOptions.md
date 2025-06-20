# Interface: IDataSpaceConnectorServiceConstructorOptions

Federated Catalogue service options

## Properties

### identityResolverComponentType?

> `optional` **identityResolverComponentType**: `string`

The identity resolver component used.

***

### loggingConnectorType?

> `optional` **loggingConnectorType**: `string`

Logging connector type

***

### config

> **config**: [`IDataSpaceConnectorServiceConfig`](IDataSpaceConnectorServiceConfig.md)

The configuration of the Federated Catalogue service.

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

### subscriptionEntityStorageType?

> `optional` **subscriptionEntityStorageType**: `string`

The entity storage for subscriptions.

#### Default

```ts
subscription-entry
```

***

### backgroundTaskConnectorType?

> `optional` **backgroundTaskConnectorType**: `string`

Background task connector.

#### Default

```ts
background-task-4-data-space
```
