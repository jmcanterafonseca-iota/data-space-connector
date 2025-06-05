# Interface: IDataSpaceConnectorApp

Interface that must be implemented by a Data Space Connector App.

## Properties

### id

> **id**: `string`

A URI that denotes the identifier of the App.

***

### handledTypes

> **handledTypes**: `object`

The types handled by this Data Space Connector App.

#### activityObjectTargetTriples

> **activityObjectTargetTriples**: [`IActivityObjectTargetTriple`](IActivityObjectTargetTriple.md)[]

#### dataResourceAssetTypes?

> `optional` **dataResourceAssetTypes**: `string`[]

FQN of the data resource asset types handled.

## Methods

### handleActivity()

> **handleActivity**(`activity`): `Promise`\<`unknown`\>

Handles an Activity and report about results through the Data Space Connector Callback

#### Parameters

##### activity

[`IActivity`](IActivity.md)

The Activity to be handled

#### Returns

`Promise`\<`unknown`\>

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
