# Interface: IActivityData

A W3C Activity from Activity Streams

## See

https://www.w3.org/TR/activitystreams-core/#activities

## Properties

### generator?

> `optional` **generator**: `string` \| `string`[] \| `IJsonLdNodeObject`

The generator of the Activity.

***

### actor

> **actor**: `string` \| `string`[] \| `IJsonLdNodeObject`

The Actor behind the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-actor

***

### object

> **object**: `IJsonLdObject` & `object`

The object affected by the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object

***

### target?

> `optional` **target**: `IJsonLdObject` & `object`

The target of the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-target

***

### summary?

> `optional` **summary**: `string` \| `IJsonLdLanguageMap`

Summary of the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-summary

***

### result?

> `optional` **result**: `IJsonLdNodeObject`

Result of the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-result

***

### origin?

> `optional` **origin**: `string` \| `string`[] \| `IJsonLdNodeObject`

Activity's origin.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-origin

***

### updated

> **updated**: `string`

The date and time at which the object was updated.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-updated
