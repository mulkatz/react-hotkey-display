import type { ReactNode } from "react";

export type Platform = "mac" | "windows" | "linux";

export type KbdVariant = "subtle" | "elevated" | "flat" | "outlined";

export type KbdSize = "sm" | "md" | "lg";

export interface KbdProps {
	/** The key to display */
	children: string;
	/** Visual variant */
	variant?: KbdVariant;
	/** Size variant */
	size?: KbdSize;
	/** Omit hkd-* CSS classes (semantic HTML only) */
	unstyled?: boolean;
	/** Additional CSS class */
	className?: string;
}

export interface HotkeyProps {
	/** Key combo string, e.g. "Mod+Shift+K" */
	combo: string;
	/** Override platform detection */
	platform?: Platform;
	/** Visual variant */
	variant?: KbdVariant;
	/** Size variant */
	size?: KbdSize;
	/** Omit hkd-* CSS classes (semantic HTML only) */
	unstyled?: boolean;
	/** Separator between keys. Default: "" on Mac, " + " on Windows/Linux */
	separator?: string;
	/** Additional CSS class */
	className?: string;
}

export interface ShortcutHintProps {
	/** Action label, e.g. "Save" */
	action: string;
	/** Key combo string, e.g. "Mod+S" */
	combo: string;
	/** Override platform detection */
	platform?: Platform;
	/** Visual variant for the keys */
	variant?: KbdVariant;
	/** Size variant */
	size?: KbdSize;
	/** Omit hkd-* CSS classes (semantic HTML only) */
	unstyled?: boolean;
	/** Additional CSS class */
	className?: string;
}

export interface ShortcutEntry {
	/** Unique identifier */
	id: string;
	/** Key combo string, e.g. "Mod+S" */
	combo: string;
	/** Human-readable description */
	description: string;
	/** Category for grouping */
	category?: string;
	/** Optional action callback */
	action?: () => void;
}

export interface ShortcutProviderProps {
	/** Initial shortcuts to register */
	shortcuts?: ShortcutEntry[];
	/** Children */
	children: ReactNode;
}

export interface ShortcutCheatsheetProps {
	/** Whether the cheatsheet is open */
	open: boolean;
	/** Callback when open state changes */
	onOpenChange: (open: boolean) => void;
	/** Shortcuts to display (overrides context) */
	shortcuts?: ShortcutEntry[];
	/** Title shown at the top */
	title?: string;
	/** Visual variant for the keys */
	variant?: KbdVariant;
	/** Size variant for the keys */
	size?: KbdSize;
	/** Override platform detection */
	platform?: Platform;
	/** Omit hkd-* CSS classes (semantic HTML only) */
	unstyled?: boolean;
	/** Additional CSS class */
	className?: string;
}

export interface ShortcutPaletteProps {
	/** Whether the palette is open */
	open: boolean;
	/** Callback when open state changes */
	onOpenChange: (open: boolean) => void;
	/** Callback when a shortcut is selected */
	onSelect?: (shortcut: ShortcutEntry) => void;
	/** Shortcuts to display (overrides context) */
	shortcuts?: ShortcutEntry[];
	/** Placeholder text for the search input */
	placeholder?: string;
	/** Visual variant for the keys */
	variant?: KbdVariant;
	/** Size variant for the keys */
	size?: KbdSize;
	/** Override platform detection */
	platform?: Platform;
	/** Omit hkd-* CSS classes (semantic HTML only) */
	unstyled?: boolean;
	/** Additional CSS class */
	className?: string;
}
