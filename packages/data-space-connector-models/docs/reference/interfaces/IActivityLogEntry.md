# Interface: IActivityLogEntry

The details related to the processing of an Activity

## Properties

### id

> **id**: `string`

The Id of the Activity Log entry.

***

### activityId?

> `optional` **activityId**: `string`

The activity Id that this entry refers to. This is obtained through a hash of the Activity itself.

***

### generator

> **generator**: `string`

The identity of the Activity's generator.

***

### status

> **status**: [`ActivityProcessingStatus`](../type-aliases/ActivityProcessingStatus.md)

Status of the Activity Processing.

***

### dateCreated

> **dateCreated**: `string`

The creation date of this object.

***

### dateUpdated

> **dateUpdated**: `string`

The last update date of this object.

***

### associatedTasks

> **associatedTasks**: [`IActivityTask`](IActivityTask.md)[]

The tasks this activity log entry is in association with.

***

### finalizedTasks

> **finalizedTasks**: [`IActivityTask`](IActivityTask.md) & `object`[]

The tasks that have already finalized.

***

### inErrorTasks

> **inErrorTasks**: [`IActivityTask`](IActivityTask.md) & `object`[]

The tasks that are in error.
