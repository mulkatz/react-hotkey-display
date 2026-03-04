import type { Platform } from "./types.js";

/** Mac modifier symbols */
const MAC_SYMBOLS: Record<string, string> = {
	mod: "\u2318", // ⌘
	command: "\u2318",
	cmd: "\u2318",
	ctrl: "\u2303", // ⌃
	control: "\u2303",
	shift: "\u21E7", // ⇧
	alt: "\u2325", // ⌥
	option: "\u2325",
	enter: "\u23CE", // ⏎
	return: "\u23CE",
	backspace: "\u232B", // ⌫
	delete: "\u2326", // ⌦
	tab: "\u21E5", // ⇥
	escape: "\u238B", // ⎋
	esc: "\u238B",
	space: "\u2423", // ␣
	up: "\u2191", // ↑
	down: "\u2193", // ↓
	left: "\u2190", // ←
	right: "\u2192", // →
	capslock: "\u21EA", // ⇪
	plus: "+",
	pageup: "Page Up",
	pagedown: "Page Down",
	home: "Home",
	end: "End",
	insert: "Insert",
	printscreen: "Print Screen",
	scrolllock: "Scroll Lock",
	pause: "Pause",
	numlock: "Num Lock",
	f1: "F1",
	f2: "F2",
	f3: "F3",
	f4: "F4",
	f5: "F5",
	f6: "F6",
	f7: "F7",
	f8: "F8",
	f9: "F9",
	f10: "F10",
	f11: "F11",
	f12: "F12",
};

/** Windows/Linux modifier labels */
const STANDARD_LABELS: Record<string, string> = {
	mod: "Ctrl",
	command: "Win",
	cmd: "Win",
	ctrl: "Ctrl",
	control: "Ctrl",
	shift: "Shift",
	alt: "Alt",
	option: "Alt",
	enter: "Enter",
	return: "Enter",
	backspace: "Backspace",
	delete: "Delete",
	tab: "Tab",
	escape: "Esc",
	esc: "Esc",
	space: "Space",
	up: "\u2191",
	down: "\u2193",
	left: "\u2190",
	right: "\u2192",
	capslock: "Caps Lock",
	plus: "+",
	pageup: "Page Up",
	pagedown: "Page Down",
	home: "Home",
	end: "End",
	insert: "Insert",
	printscreen: "Print Screen",
	scrolllock: "Scroll Lock",
	pause: "Pause",
	numlock: "Num Lock",
	f1: "F1",
	f2: "F2",
	f3: "F3",
	f4: "F4",
	f5: "F5",
	f6: "F6",
	f7: "F7",
	f8: "F8",
	f9: "F9",
	f10: "F10",
	f11: "F11",
	f12: "F12",
};

/** Screen reader labels for special keys */
export const ARIA_LABELS: Record<string, string> = {
	"\u2318": "Command",
	"\u2303": "Control",
	"\u21E7": "Shift",
	"\u2325": "Option",
	"\u23CE": "Enter",
	"\u232B": "Backspace",
	"\u2326": "Delete",
	"\u21E5": "Tab",
	"\u238B": "Escape",
	"\u2423": "Space",
	"\u2191": "Up",
	"\u2193": "Down",
	"\u2190": "Left",
	"\u2192": "Right",
	"\u21EA": "Caps Lock",
	"+": "Plus",
};

/** Format a single key for a given platform */
export function formatKey(key: string, platform: Platform): string {
	const normalized = key.toLowerCase().trim();

	if (platform === "mac") {
		return MAC_SYMBOLS[normalized] ?? key.toUpperCase();
	}

	return STANDARD_LABELS[normalized] ?? key.toUpperCase();
}

/**
 * Parse a combo string like "Mod+Shift+K" into individual keys.
 *
 * Handles edge cases:
 * - "Mod+Plus" → ["Mod", "Plus"] (the "Plus" key name)
 * - "Ctrl++" → ["Ctrl", "+"] (trailing "+" is a literal plus key)
 * - "Mod+Shift++" → ["Mod", "Shift", "+"]
 */
export function parseCombo(combo: string): string[] {
	const keys: string[] = [];
	const trimmed = combo.trim();

	// Handle trailing "+" as a literal plus key: "Ctrl++", "Mod+Shift++"
	let remaining = trimmed;
	let hasTrailingPlus = false;

	if (remaining.endsWith("++")) {
		hasTrailingPlus = true;
		remaining = remaining.slice(0, -2);
	}

	const parts = remaining
		.split("+")
		.map((k) => k.trim())
		.filter(Boolean);

	keys.push(...parts);

	if (hasTrailingPlus) {
		keys.push("+");
	}

	return keys;
}

/** Format a full combo for display */
export function formatCombo(combo: string, platform: Platform): string[] {
	return parseCombo(combo).map((key) => formatKey(key, platform));
}

/** Get screen reader label for a formatted key */
export function getAriaLabel(formattedKey: string): string {
	return ARIA_LABELS[formattedKey] ?? formattedKey;
}

/** Get full aria label for a combo */
export function getComboAriaLabel(formattedKeys: string[]): string {
	return formattedKeys.map(getAriaLabel).join(" plus ");
}
