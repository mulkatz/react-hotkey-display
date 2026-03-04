export type Platform = "mac" | "windows" | "linux";

export type KbdVariant = "subtle" | "elevated" | "flat" | "outlined";

export interface KbdProps {
	/** The key to display */
	children: string;
	/** Visual variant */
	variant?: KbdVariant;
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
	/** Separator between keys. Default: " " (space) */
	separator?: string;
	/** Additional CSS class */
	className?: string;
}
