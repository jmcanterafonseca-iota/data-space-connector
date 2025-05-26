// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinition } from "@twin.org/data-json-ld";
import { entity, property, SortDirection } from "@twin.org/entity";

/**
 * Subscription Entry.
 */
@entity()
export class SubscriptionEntry {
	/**
	 * The LD Context
	 */
	@property({ type: "string", format: "json", isPrimary: true })
	public "@context"!: IJsonLdContextDefinition;

	/**
	 * The entry Id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The generator of the Subscription.
	 */
	@property({ type: "string" })
	public generator!: string;

	/**
	 * The creation date.
	 */
	@property({ type: "string", format: "date-time", sortDirection: SortDirection.Descending })
	public dateCreated!: string;

	/**
	 * The update date.
	 */
	@property({ type: "string", format: "date-time" })
	public dateUpdated!: string;
}
