# Class: ActivityLogEntry

Activity Log Entry.

## Constructors

### Constructor

> **new ActivityLogEntry**(): `ActivityLogEntry`

#### Returns

`ActivityLogEntry`

## Properties

### id

> **id**: `string`

The entry Id.

***

### activityId?

> `optional` **activityId**: `string`

The Activity Id.

***

### status

> **status**: `ActivityProcessingStatus`

The status

***

### generator

> **generator**: `string`

The generator of the activity

***

### dateCreated

> **dateCreated**: `string`

The creation date.

***

### dateUpdated

> **dateUpdated**: `string`

The update date.

***

### startTime?

> `optional` **startTime**: `string`

The start time.

***

### endTime?

> `optional` **endTime**: `string`

The end time.

***

### processingResult?

> `optional` **processingResult**: `unknown`

The processing result.

***

### processingError?

> `optional` **processingError**: `Error`

The processing error.
