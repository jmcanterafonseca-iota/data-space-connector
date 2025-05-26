# Interface: IDataSpaceConnectorApp

Interface that must be implemented by a Data Space Connector App.

## Properties

### handledTypes

> **handledTypes**: `object`

The types handled by this Data Space Connector App.

#### activityObjectTypes?

> `optional` **activityObjectTypes**: `string`[]

#### activityTargetTypes?

> `optional` **activityTargetTypes**: `string`[]

#### dataResourceAssetTypes?

> `optional` **dataResourceAssetTypes**: `string`[]

## Methods

### handleActivity()

> **handleActivity**(`activity`, `callback`): `void`

Handles an Activity and report about results through the Data Space Connector Callback

#### Parameters

##### activity

[`IActivity`](IActivity.md)

The Activity to be handled

##### callback

[`IDataSpaceConnectorCallback`](IDataSpaceConnectorCallback.md)

The Callback.

#### Returns

`void`

***

### handleDataResource()

> **handleDataResource**(`dataResourceId`, `query?`): `Promise`\<`IJsonLdNodeObject`\>

Handles a data resource.

#### Parameters

##### dataResourceId

`string`

The Data Resource Id.

##### query?

[`IDataSpaceQuery`](IDataSpaceQuery.md)

The Data Space query.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

A JSON-Ld Object with the results of the query over a Data Resource.
