# Variable: ActivityProcessingStatus

> `const` **ActivityProcessingStatus**: `object`

Activity processing statuses.

## Type declaration

### Pending

> `readonly` **Pending**: `"pending"` = `"pending"`

Pending: Activity Processing has not started yet.

### Running

> `readonly` **Running**: `"running"` = `"running"`

Running Activity processing is running.

### Completed

> `readonly` **Completed**: `"completed"` = `"completed"`

Completed: Activity processing completed without error.

### Failed

> `readonly` **Failed**: `"failed"` = `"failed"`

Failed: Activity processing failed (i.e. exception happened).

### Error

> `readonly` **Error**: `"error"` = `"error"`

Error: Activity processing cannot be performed and marked as in error. (Depends on application).

### Unknown

> `readonly` **Unknown**: `"unknown"` = `"unknown"`

Unknown: It is not possible to determine the current processing status (transient situation)
