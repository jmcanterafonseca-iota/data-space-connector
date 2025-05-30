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
activity-log-entry
```

***

### subscriptionEntityStorageType?

> `optional` **subscriptionEntityStorageType**: `string`

The entity storage for subscriptions.

#### Default

```ts
subscription-entry
```
