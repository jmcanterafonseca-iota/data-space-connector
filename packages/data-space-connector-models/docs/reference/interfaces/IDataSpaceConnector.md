# Interface: IDataSpaceConnector

Data Space Connector service interface.

## Extends

- `IComponent`

## Methods

### start()

> **start**(`nodeIdentity`, `nodeLoggingConnectorType?`): `Promise`\<`void`\>

Start method.

#### Parameters

##### nodeIdentity

`string`

Node Identity.

##### nodeLoggingConnectorType?

`string`

Node Logging Connector Type.

#### Returns

`Promise`\<`void`\>

nothing

#### Overrides

`IComponent.start`

***

### notifyActivity()

> **notifyActivity**(`activity`): `Promise`\<`string`\>

Notify an Activity to the DS Connector Activity Stream.

#### Parameters

##### activity

`IActivity`

The Activity notified.

#### Returns

`Promise`\<`string`\>

The Activity's identifier.

***

### subscribeToActivityLog()

> **subscribeToActivityLog**(`callback`, `subscriptionId?`): `string`

Subscribes to the activity log.

#### Parameters

##### callback

(`notification`) => `Promise`\<`void`\>

The callback to be called when Activity Log is called.

##### subscriptionId?

`string`

The subscription Id.

#### Returns

`string`

The subscription Id.

***

### unSubscribeToActivityLog()

> **unSubscribeToActivityLog**(`subscriptionId`): `void`

Unsubscribes to the activity log.

#### Parameters

##### subscriptionId

`string`

The subscription Id.

#### Returns

`void`

The subscription Id.

***

### getActivityLogEntry()

> **getActivityLogEntry**(`logEntryId`): `Promise`\<[`IActivityLogEntry`](IActivityLogEntry.md)\>

Returns Activity Log Entry which contains the Activity processing details.

#### Parameters

##### logEntryId

`string`

The Id of the Activity Log Entry (a URI).

#### Returns

`Promise`\<[`IActivityLogEntry`](IActivityLogEntry.md)\>

the Activity Log Entry with the processing details.

#### Throws

NotFoundError if activity log entry is not known.

***

### subscribe()

> **subscribe**(`subscription`): `Promise`\<`string`\>

Subscribe to the Data Space Connector.

#### Parameters

##### subscription

[`ISubscription`](ISubscription.md)

The subscription

#### Returns

`Promise`\<`string`\>

The Subscription Entry identifier.

***

### getSubscriptionEntry()

> **getSubscriptionEntry**(`entryId`): `Promise`\<[`ISubscription`](ISubscription.md)\>

Returns a subscription entry.

#### Parameters

##### entryId

`string`

The entry Id (a URI)

#### Returns

`Promise`\<[`ISubscription`](ISubscription.md)\>

The subscription entry with all Subscription details

***

### getData()

> **getData**(`dataResourceId`, `serviceOfferingId?`, `query?`): `Promise`\<`IJsonLdDocument`\>

Gets data associated with a Service Offering.

#### Parameters

##### dataResourceId

`string`

The corresponding Data Resource as registered on the Federated Catalogue.

##### serviceOfferingId?

`string`

The Service Offering Id as registered on the Federated Catalogue.

##### query?

[`IDataSpaceQuery`](IDataSpaceQuery.md)

The Data Space Connector query.

#### Returns

`Promise`\<`IJsonLdDocument`\>

a JSON-LD document with the data

***

### registerDataSpaceConnectorApp()

> **registerDataSpaceConnectorApp**(`app`): `Promise`\<`void`\>

Registers a Data Space Connector App.

#### Parameters

##### app

[`IDataSpaceConnectorAppDescriptor`](IDataSpaceConnectorAppDescriptor.md)

The descriptor of the App to be registered.

#### Returns

`Promise`\<`void`\>

nothing.
