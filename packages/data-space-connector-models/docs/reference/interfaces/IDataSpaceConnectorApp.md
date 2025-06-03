# Interface: IDataSpaceConnectorApp

Interface that must be implemented by a Data Space Connector App.

## Properties

### handledTypes

> **handledTypes**: `object`

The types handled by this Data Space Connector App.

#### activityTypes?

> `optional` **activityTypes**: \[\]

FQN of the activity types handled.

#### activityObjectTypes?

> `optional` **activityObjectTypes**: `string`[]

FQN of the activity object types handled.

#### activityTargetTypes?

> `optional` **activityTargetTypes**: `string`[]

FQN of the activity target types handled.

#### dataResourceAssetTypes?

> `optional` **dataResourceAssetTypes**: `string`[]

FQN of the data resource asset types handled.

## Methods

### handleActivity()

> **handleActivity**\<`T`\>(`activity`): `Promise`\<`T`\>

Handles an Activity and report about results through the Data Space Connector Callback

#### Type Parameters

##### T

`T`

#### Parameters

##### activity

[`IActivity`](IActivity.md)

The Activity to be handled

#### Returns

`Promise`\<`T`\>

The result of executing the Activity.

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
