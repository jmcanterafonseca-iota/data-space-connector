# Interface: IDataResourceHandler

Data Resource handler.

## Extended by

- [`IDataSpaceConnectorApp`](IDataSpaceConnectorApp.md)

## Methods

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
