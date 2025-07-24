# Class: DataSpaceConnectorService

Data Space Connector Service.

## Implements

- `IDataSpaceConnector`

## Constructors

### Constructor

> **new DataSpaceConnectorService**(`options`): `DataSpaceConnectorService`

Create a new instance of FederatedCatalogue service.

#### Parameters

##### options

[`IDataSpaceConnectorServiceConstructorOptions`](../interfaces/IDataSpaceConnectorServiceConstructorOptions.md)

The options for the connector.

#### Returns

`DataSpaceConnectorService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IDataSpaceConnector.CLASS_NAME`

## Methods

### start()

> **start**(`nodeIdentity`, `nodeLoggingConnectorType?`): `Promise`\<`void`\>

Start step. It just registers the Data Space Connector Apps initial descriptors.

#### Parameters

##### nodeIdentity

`string`

Node Identity

##### nodeLoggingConnectorType?

`string`

Node Logging Connector type.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IDataSpaceConnector.start`

***

### notifyActivity()

> **notifyActivity**(`activity`): `Promise`\<`string`\>

Notify an Activity.

#### Parameters

##### activity

`IActivity`

The Activity notified.

#### Returns

`Promise`\<`string`\>

The Activity's Log Entry identifier.

#### Implementation of

`IDataSpaceConnector.notifyActivity`

***

### subscribeToActivityLog()

> **subscribeToActivityLog**(`callback`): `string`

Subscribes to the activity log.

#### Parameters

##### callback

(`notification`) => `Promise`\<`void`\>

The callback to be called when Activity Log is called.

#### Returns

`string`

The subscription Id.

#### Implementation of

`IDataSpaceConnector.subscribeToActivityLog`

***

### getActivityLogEntry()

> **getActivityLogEntry**(`logEntryId`): `Promise`\<`IActivityLogEntry`\>

Returns the activity processing details of an activity.

#### Parameters

##### logEntryId

`string`

The Id of the Activity Log Entry (a URI).

#### Returns

`Promise`\<`IActivityLogEntry`\>

the Activity Log Entry with the processing details.

#### Throws

NotFoundError if activity log entry is not known.

#### Implementation of

`IDataSpaceConnector.getActivityLogEntry`

***

### subscribe()

> **subscribe**(`subscription`): `Promise`\<`string`\>

Subscribe to the Data Space Connector.

#### Parameters

##### subscription

`ISubscription`

The subscription

#### Returns

`Promise`\<`string`\>

void

#### Implementation of

`IDataSpaceConnector.subscribe`

***

### getSubscriptionEntry()

> **getSubscriptionEntry**(`entryId`): `Promise`\<`ISubscription`\>

Returns a subscription entry.

#### Parameters

##### entryId

`string`

The entry Id (a URI)

#### Returns

`Promise`\<`ISubscription`\>

The subscription entry

#### Implementation of

`IDataSpaceConnector.getSubscriptionEntry`

***

### getData()

> **getData**(`serviceOfferingId`, `dataResourceId?`, `query?`): `Promise`\<`IJsonLdDocument`\>

Gets data associated with a Service Offering.

#### Parameters

##### serviceOfferingId

`string`

The Service Offering Id as registered on the Federated Catalogue.

##### dataResourceId?

`string`

The Data Resource as registered on the Federated Catalogue.

##### query?

`IDataSpaceQuery`

The Data Space Connector query.

#### Returns

`Promise`\<`IJsonLdDocument`\>

a JSON-LD document with the data

#### Implementation of

`IDataSpaceConnector.getData`

***

### registerDataSpaceConnectorApp()

> **registerDataSpaceConnectorApp**(`app`): `Promise`\<`void`\>

Registers a Data Space Connector App.

#### Parameters

##### app

`IDataSpaceConnectorAppDescriptor`

The App to be registered.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IDataSpaceConnector.registerDataSpaceConnectorApp`
