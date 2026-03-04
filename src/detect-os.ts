import type { Platform } from "./types.js";

let cachedPlatform: Platform | null = null;

/** Reset the cached platform (useful for testing) */
export function resetPlatformCache(): void {
	cachedPlatform = null;
}

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
	} else if (ua.includes("android")) {
		// Android UA contains "Linux" — detect it explicitly before the Linux check
		cachedPlatform = "linux";
	} else if (platform.includes("linux") || ua.includes("linux")) {
		cachedPlatform = "linux";
	} else {
		cachedPlatform = "windows";
	}

	return cachedPlatform;
}

/** SSR-safe snapshot: always returns "windows" on the server */
function getServerSnapshot(): Platform {
	return "windows";
}

/** Client snapshot: returns the detected platform */
function getSnapshot(): Platform {
	return detectPlatform();
}

// Subscribers — useSyncExternalStore requires subscribe but platform never changes
function subscribe(_callback: () => void): () => void {
	// Platform doesn't change at runtime, so we never call the callback
	return () => {};
}

/**
 * SSR-safe platform detection store for use with useSyncExternalStore.
 * Exported so the Hotkey component can use it directly without importing React here.
 */
export const platformStore = {
	getSnapshot,
	getServerSnapshot,
	subscribe,
};
