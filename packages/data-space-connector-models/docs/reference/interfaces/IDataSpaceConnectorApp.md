# Interface: IDataSpaceConnectorApp

Interface describes a Data Space Connector App.

## Extends

- `IComponent`.[`IDataResourceHandler`](IDataResourceHandler.md).[`IActivityHandler`](IActivityHandler.md)

## Methods

### handleActivity()

> **handleActivity**\<`T`\>(`activity`): `Promise`\<`T`\>

Handles an Activity and report about results through the Data Space Connector Callback

#### Type Parameters

##### T

`T`

#### Parameters

##### activity

`IActivity`

The Activity to be handled

#### Returns

`Promise`\<`T`\>

The result of executing the Activity.

#### Inherited from

[`IActivityHandler`](IActivityHandler.md).[`handleActivity`](IActivityHandler.md#handleactivity)

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

#### Inherited from

[`IDataResourceHandler`](IDataResourceHandler.md).[`handleDataResource`](IDataResourceHandler.md#handledataresource)
