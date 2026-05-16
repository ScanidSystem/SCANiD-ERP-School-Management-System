import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses a value to a number, returning undefined if invalid.
 * Prevents sending NaN to the backend which causes 400 errors.
 */
export function parseSafeInt(value: any): number | undefined {
  if (value === null || value === undefined || value === "" || value === "all" || value === "NaN" || value === "null") {
    return undefined;
  }
  const parsed = parseInt(value.toString());
  return isNaN(parsed) ? undefined : parsed;
}
