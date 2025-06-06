# Interface: IActivityHandler

Activity Handler.

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
