// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IComponent } from "@twin.org/core";
import type { IActivityHandler } from "./IActivityHandler";

/**
 * Interface describes a Data Space Connector App.
 */
export interface IDataSpaceConnectorApp extends IComponent, IActivityHandler {}
