# Interface: IActivityLogEntry

The details related to the processing of an Activity

## Extends

- [`IActivityLogDetails`](IActivityLogDetails.md)

## Properties

### id

> **id**: `string`

The Id of the Activity Log entry.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`id`](IActivityLogDetails.md#id)

***

### activityId?

> `optional` **activityId**: `string`

The activity Id that this entry refers to. This is obtained through a hash of the Activity itself.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`activityId`](IActivityLogDetails.md#activityid)

***

### generator

> **generator**: `string`

The identity of the Activity's generator.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`generator`](IActivityLogDetails.md#generator)

***

### status

> **status**: [`ActivityProcessingStatus`](../type-aliases/ActivityProcessingStatus.md)

Status of the Activity Processing.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`status`](IActivityLogDetails.md#status)

***

### dateCreated

> **dateCreated**: `string`

The creation date of this object.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`dateCreated`](IActivityLogDetails.md#datecreated)

***

### dateUpdated

> **dateUpdated**: `string`

The last update date of this object.

#### Inherited from

[`IActivityLogDetails`](IActivityLogDetails.md).[`dateUpdated`](IActivityLogDetails.md#dateupdated)

***

### associatedTasks?

> `optional` **associatedTasks**: [`ITaskApp`](ITaskApp.md)[]

The tasks this activity log entry is in association with.

***

### finalizedTasks?

> `optional` **finalizedTasks**: [`ITaskApp`](ITaskApp.md) & `object`[]

The tasks that have already finalized.

***

### inErrorTasks?

> `optional` **inErrorTasks**: [`ITaskApp`](ITaskApp.md) & `object`[]

The tasks that are in error.
