# Interface: IDataSpaceConnectorCallback

Data Space Connector Callback interface.

## Methods

### activityProcessingFinalized()

> **activityProcessingFinalized**(`activityId`, `result?`, `error?`): `Promise`\<`void`\>

Callback invoked by a Data Space Connector App when the processing of an Activity has finalized.

#### Parameters

##### activityId

`string`

The Activity Id.

##### result?

`unknown`

The processing result.

##### error?

`Error`

Error (if there was any).

#### Returns

`Promise`\<`void`\>

nothing.
