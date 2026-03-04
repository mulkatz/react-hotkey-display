import { useSyncExternalStore } from "react";
import { platformStore } from "./detect-os.js";
import type { Platform } from "./types.js";

/**
 * SSR-safe hook to detect the user's platform.
 * Returns "windows" on the server (consistent for hydration),
 * then the actual platform on the client.
 */
export function usePlatform(override?: Platform): Platform {
	const detected = useSyncExternalStore(
		platformStore.subscribe,
		platformStore.getSnapshot,
		platformStore.getServerSnapshot,
	);

	return override ?? detected;
}
