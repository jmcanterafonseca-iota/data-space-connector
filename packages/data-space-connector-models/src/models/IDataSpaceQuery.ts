// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Represents a query used within a Data Space
 */
export interface IDataSpaceQuery {
	/**
	 * The query language used.
	 */
	queryLanguage: string;

	/**
	 * The query content itself.
	 */
	query: string;
}
