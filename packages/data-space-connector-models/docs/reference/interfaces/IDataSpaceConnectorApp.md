# Interface: IDataSpaceConnectorApp

Interface describes a Data Space Connector App.

## Extends

- `IComponent`.[`IDataResourceHandler`](IDataResourceHandler.md).[`IActivityHandler`](IActivityHandler.md)

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
