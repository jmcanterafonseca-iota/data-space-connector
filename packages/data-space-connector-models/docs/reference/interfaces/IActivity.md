# Interface: IActivity

A W3C Activity from Activity Streams

## See

https://www.w3.org/TR/activitystreams-core/#activities

## Extends

- `IJsonLdNodeObject`

## Indexable

\[`key`: `string`\]: `undefined` \| `null` \| `string` \| `number` \| `boolean` \| `IJsonLdContextDefinition` \| `IJsonLdNodeObject` \| `IJsonLdGraphObject` \| `object` & `object` \| `object` & `object` \| `object` & `object` \| `IJsonLdListObject` \| `IJsonLdSetObject` \| `IJsonLdNodePrimitive`[] \| `IJsonLdLanguageMap` \| `IJsonLdIndexMap` \| `IJsonLdNodeObject`[] \| `IJsonLdIdMap` \| `IJsonLdTypeMap` \| `string`[] \| `IJsonLdContextDefinitionElement`[] \| `IJsonLdJsonObject` \| `IJsonLdJsonObject`[] \| \{[`key`: `string`]: `string`; \}

## Properties

### @context

> **@context**: [`ActivityStreamsLdContextType`](../type-aliases/ActivityStreamsLdContextType.md)

The LD Context.

#### Overrides

`IJsonLdNodeObject.@context`

***

### type

> **type**: [`ActivityTypeJsonLd`](../type-aliases/ActivityTypeJsonLd.md)

Activity Type.

***

### generator?

> `optional` **generator**: `string` \| `IJsonLdNodeObject` \| `string`[]

The generator of the Activity.

***

### actor

> **actor**: `string` \| `IJsonLdNodeObject` \| `string`[]

The Actor behind the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-actor

***

### object

> **object**: `IJsonLdNodeObject`

The object affected by the Activity.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object

***

### target?

> `optional` **target**: `IJsonLdNodeObject`

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

> `optional` **origin**: `string` \| `IJsonLdNodeObject` \| `string`[]

Activity's origin.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-origin

***

### updated

> **updated**: `string`

The date and time at which the object was updated.

#### See

https://www.w3.org/TR/activitystreams-vocabulary/#dfn-updated
