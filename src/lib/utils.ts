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
 * Handles production prefixing (e.g., scanid_erp_api) based on VITE_API_BASE_URL and dynamic window.location.
 */
export function resolvePhotoUrl(path: string | undefined): string {
  if (!path) return "";
  
  // If it's already an absolute URL or data URI, return directly
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  
  // 1. Normalize Windows backslashes to standard URL forward slashes
  let cleanPath = path.replace(/\\/g, "/");
  
  // 2. Strip any Windows drive letter prefix (e.g. C:/)
  const driveLetterMatch = cleanPath.match(/^[a-zA-Z]:\//);
  if (driveLetterMatch) {
    cleanPath = cleanPath.substring(driveLetterMatch[0].length);
  }
  
  // 3. Strip any redundant "wwwroot/" directory folder prefix from C# wwwroot builds
  const wwwrootIndex = cleanPath.indexOf("wwwroot/");
  if (wwwrootIndex !== -1) {
    cleanPath = cleanPath.substring(wwwrootIndex + 8);
  } else {
    // If the path contains "photos/" or "uploads/" deeper inside, extract from there
    const photosIndex = cleanPath.indexOf("photos/");
    const uploadsIndex = cleanPath.indexOf("uploads/");
    if (photosIndex !== -1) {
      cleanPath = cleanPath.substring(photosIndex);
    } else if (uploadsIndex !== -1) {
      cleanPath = cleanPath.substring(uploadsIndex);
    }
  }
  
  // 4. Remove any double leading slashes and standardize
  while (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // 2. Get the configured API Base URL
  const rawApiBase = import.meta.env.VITE_API_BASE_URL || "/api";
  let apiBase = rawApiBase.replace(/\/+$/, "");

  // Prevent double prefixing if the path already starts with the apiBase directory segment
  const scanidPrefix = "scanid_erp_api/";
  if (cleanPath.toLowerCase().startsWith(scanidPrefix)) {
    cleanPath = cleanPath.substring(scanidPrefix.length);
  }
  if (apiBase && apiBase.startsWith("/") && cleanPath.toLowerCase().startsWith(apiBase.substring(1).toLowerCase() + "/")) {
    cleanPath = cleanPath.substring(apiBase.substring(1).length + 1);
  }
  
  // 5. Detect dynamic subpath prefix from browser URL window.location (self-healing for proxy/hosted subpaths)
  let dynamicSubpath = "";
  if (typeof window !== "undefined" && window.location) {
    const pathname = window.location.pathname; // e.g., "/scanid_erp_api/teachers"
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && segments[0].toLowerCase().includes("scanid")) {
      dynamicSubpath = `/${segments[0]}`; // e.g., "/scanid_erp_api" matching the browser's exact casing
    }
  }
  
  // If absolute API URL (e.g., https://api.scaniderp.com/api)
  if (apiBase.startsWith("http://") || apiBase.startsWith("https://")) {
    const urlObj = new URL(apiBase);
    let pathname = urlObj.pathname.replace(/\/+$/, "");
    if (pathname.toLowerCase().endsWith("/api")) {
      pathname = pathname.slice(0, -4);
    }
    return `${urlObj.origin}${pathname}/${cleanPath}`;
  }
  
  // For relative paths:
  if (apiBase.toLowerCase().endsWith("/api")) {
    apiBase = apiBase.slice(0, -4); // e.g., "/SCANiD_ERP_API" or ""
  }

  // If a dynamic subpath was detected from the browser's active path (e.g., "/scanid_erp_api")
  // and it matches the config path case-insensitively, we prefer the dynamic browser casing to ensure perfect routing.
  if (dynamicSubpath) {
    if (apiBase && apiBase.toLowerCase() === dynamicSubpath.toLowerCase()) {
      return `${dynamicSubpath}/${cleanPath}`;
    }
    // Fallback/Force prefixing if the route is served through subpath but apiBase is "/api"
    if (!apiBase || apiBase === "/api") {
      return `${dynamicSubpath}/${cleanPath}`;
    }
  }

  // If we have an override with a relative base path
  if (apiBase && apiBase !== "/api") {
    return `${apiBase}/${cleanPath}`;
  }
  
  // Fallback to absolute root file path if no specific config is resolved
  return `/${cleanPath}`;
}

