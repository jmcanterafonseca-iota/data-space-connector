// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Activity processing statuses.
 */
export type ActivityProcessingStatus = "pending" | "running" | "completed" | "failed" | "error";

/*
 * Pending: Activity Processing has not started yet.
 * Running Activity processing is running.
 * Completed: Activity processing completed without error.
 * Failed: Activity processing failed (i.e. exception happened).
 * Error: Activity processing cannot be performed and marked as in error. (Depends on application).
 */
