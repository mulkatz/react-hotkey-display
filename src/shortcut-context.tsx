import { createContext, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { ShortcutEntry, ShortcutProviderProps } from "./types.js";

type Listener = () => void;

const EMPTY_ARRAY: ShortcutEntry[] = [];

class ShortcutStore {
	private entries: Map<string, ShortcutEntry> = new Map();
	private listeners: Set<Listener> = new Set();
	private cachedSnapshot: ShortcutEntry[] = EMPTY_ARRAY;

	getSnapshot = (): ShortcutEntry[] => {
		return this.cachedSnapshot;
	};

	getServerSnapshot = (): ShortcutEntry[] => {
		return EMPTY_ARRAY;
	};

	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	register(entry: ShortcutEntry): void {
		this.entries.set(entry.id, entry);
		this.updateSnapshot();
		this.notify();
	}

	unregister(id: string): void {
		this.entries.delete(id);
		this.updateSnapshot();
		this.notify();
	}

	setAll(entries: ShortcutEntry[]): void {
		this.entries.clear();
		for (const entry of entries) {
			this.entries.set(entry.id, entry);
		}
		this.updateSnapshot();
		this.notify();
	}

	private updateSnapshot(): void {
		this.cachedSnapshot = Array.from(this.entries.values());
	}

	private notify(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}

interface ShortcutContextValue {
	store: ShortcutStore;
}

const ShortcutContext = createContext<ShortcutContextValue | null>(null);

/** Provider that holds a registry of shortcuts for cheatsheet/palette consumption */
export function ShortcutProvider({ shortcuts, children }: ShortcutProviderProps) {
	const store = useMemo(() => new ShortcutStore(), []);

	useEffect(() => {
		if (shortcuts) {
			store.setAll(shortcuts);
		}
	}, [store, shortcuts]);

	const value = useMemo(() => ({ store }), [store]);

	return <ShortcutContext.Provider value={value}>{children}</ShortcutContext.Provider>;
}

/** Read all registered shortcuts from the nearest ShortcutProvider */
export function useShortcuts(): ShortcutEntry[] {
	const ctx = useContext(ShortcutContext);
	if (!ctx) {
		throw new Error("useShortcuts must be used within a <ShortcutProvider>");
	}

	return useSyncExternalStore(
		ctx.store.subscribe,
		ctx.store.getSnapshot,
		ctx.store.getServerSnapshot,
	);
}

/** Register a shortcut dynamically. Automatically unregisters on unmount. */
export function useRegisterShortcut(entry: ShortcutEntry): void {
	const ctx = useContext(ShortcutContext);
	if (!ctx) {
		throw new Error("useRegisterShortcut must be used within a <ShortcutProvider>");
	}

	// Use ref to hold latest entry without triggering re-registration
	const entryRef = useRef(entry);
	entryRef.current = entry;

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-register when entry fields change via ref
	useEffect(() => {
		const current = entryRef.current;
		ctx.store.register(current);
		return () => {
			ctx.store.unregister(current.id);
		};
	}, [ctx.store, entry.id, entry.combo, entry.description, entry.category]);
}

/** Hook to read shortcuts from context, with optional prop override */
export function useContextShortcuts(propShortcuts?: ShortcutEntry[]): ShortcutEntry[] {
	const ctx = useContext(ShortcutContext);
	const storeShortcuts = useSyncExternalStore(
		ctx?.store.subscribe ?? noopSubscribe,
		ctx?.store.getSnapshot ?? emptySnapshot,
		ctx?.store.getServerSnapshot ?? emptySnapshot,
	);

	return propShortcuts ?? storeShortcuts;
}

function noopSubscribe(_cb: () => void): () => void {
	return () => {};
}

function emptySnapshot(): ShortcutEntry[] {
	return EMPTY_ARRAY;
}
