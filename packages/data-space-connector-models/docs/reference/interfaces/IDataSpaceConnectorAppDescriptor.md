# Interface: IDataSpaceConnectorAppDescriptor

Interface describes a Data Space Connector App.

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

***

### moduleName

> **moduleName**: `string`

The module that implements this DS Connector App

***

### initialiserName?

> `optional` **initialiserName**: `string`

The function that allows the initialisation of this DS Connector App

#### Default

```ts
"appInitialiser"
```
