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

### startTime?

> `optional` **startTime**: `string`

Activity processing start time (filled if it has actually started).

***

### endTime?

> `optional` **endTime**: `string`

Activity's end time (filled if it has actually finished).

***

### processingResult?

> `optional` **processingResult**: `unknown`

The result of processing the Activity.

***

### processingError?

> `optional` **processingError**: `Error`

Error resulting from processing the Activity.
