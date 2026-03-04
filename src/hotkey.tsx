import { detectPlatform } from "./detect-os.js";
import { formatCombo, getComboAriaLabel } from "./format.js";
import { Kbd } from "./kbd.js";
import type { HotkeyProps } from "./types.js";

/** Display a keyboard shortcut combo with automatic OS detection */
export function Hotkey({
	combo,
	platform,
	variant = "elevated",
	separator,
	className,
}: HotkeyProps) {
	const resolvedPlatform = platform ?? detectPlatform();
	const keys = formatCombo(combo, resolvedPlatform);
	const ariaLabel = getComboAriaLabel(keys);

	// On Mac, modifiers are shown as symbols without separator
	// On Windows/Linux, use "+" as default separator
	const defaultSep = resolvedPlatform === "mac" ? "" : " + ";
	const sep = separator ?? defaultSep;

	return (
		<span className={["hkd-hotkey", className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
			{keys.map((key, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: keys are static per render, index is stable
				<span key={`${key}-${i}`}>
					{i > 0 && sep && (
						<span className="hkd-separator" aria-hidden="true">
							{sep}
						</span>
					)}
					<Kbd variant={variant}>{key}</Kbd>
				</span>
			))}
		</span>
	);
}
