# Interface: IDataSpaceConnector

Data Space Connector service interface

## Methods

### notify()

> **notify**(`activity`): `Promise`\<`void`\>

Notify an Activity.

#### Parameters

##### activity

[`IActivity`](IActivity.md)

The Activity notified.

#### Returns

`Promise`\<`void`\>

void

***

### subscribe()

> **subscribe**(`subscription`): `Promise`\<`void`\>

Subscribe to the Data Space Connector.

#### Parameters

##### subscription

[`ISubscription`](ISubscription.md)

The subscription

#### Returns

`Promise`\<`void`\>

void

***

### getData()

> **getData**(`serviceOfferingId`): `Promise`\<`IJsonLdDocument`\>

Gets data associated with a Service Offering.

#### Parameters

##### serviceOfferingId

`string`

The Service Offering Id as registered on the Fed Catalogue.

#### Returns

`Promise`\<`IJsonLdDocument`\>

a JSON-LD document with the data
