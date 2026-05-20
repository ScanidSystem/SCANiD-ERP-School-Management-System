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

/**
 * Resolves relative photo paths to absolute or correctly prefixed URLs.
 * Handles production prefixing (e.g., scanid_erp_api) based on VITE_API_BASE_URL.
 */
export function resolvePhotoUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");
  
  if (apiBase.startsWith("http://") || apiBase.startsWith("https://")) {
    if (apiBase.toLowerCase().endsWith("/api")) {
      const strippedBase = apiBase.slice(0, -4);
      return `${strippedBase}/${cleanPath}`;
    }
    return `${apiBase}/${cleanPath}`;
  }
  
  if (apiBase.toLowerCase().endsWith("/api")) {
    const strippedBase = apiBase.slice(0, -4);
    return `${strippedBase}/${cleanPath}`;
  }
  
  if (apiBase !== "/api") {
    return `${apiBase}/${cleanPath}`;
  }
  
  return `/${cleanPath}`;
}

