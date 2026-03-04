import type { Platform } from "./types.js";

let cachedPlatform: Platform | null = null;

/** Detect the user's operating system */
export function detectPlatform(): Platform {
	if (cachedPlatform) return cachedPlatform;

	if (typeof navigator === "undefined") {
		// SSR fallback — default to generic (non-Mac)
		return "windows";
	}

	const ua = navigator.userAgent.toLowerCase();
	// @ts-expect-error — navigator.userAgentData is not yet in all TS lib types
	const platform = (navigator.userAgentData?.platform ?? navigator.platform ?? "").toLowerCase();

	if (platform.includes("mac") || ua.includes("macintosh")) {
		cachedPlatform = "mac";
	} else if (platform.includes("linux") || ua.includes("linux")) {
		cachedPlatform = "linux";
	} else {
		cachedPlatform = "windows";
	}

	return cachedPlatform;
}
