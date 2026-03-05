import { memo } from "react";
import { formatCombo, getComboAriaLabel } from "./format.js";
import { Kbd } from "./kbd.js";
import type { HotkeyProps } from "./types.js";
import { usePlatform } from "./use-platform.js";

/** Display a keyboard shortcut combo with automatic OS detection */
export const Hotkey = memo(function Hotkey({
	combo,
	platform,
	variant = "elevated",
	size = "md",
	unstyled = false,
	separator,
	className,
}: HotkeyProps) {
	const resolvedPlatform = usePlatform(platform);

	// Space separates sequence steps: "G G" → [["G"], ["G"]]
	const steps = combo
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((step) => formatCombo(step, resolvedPlatform));

	const allKeys = steps.flat();
	if (allKeys.length === 0) return null;

	const ariaLabel = steps.map((stepKeys) => getComboAriaLabel(stepKeys)).join(" then ");

	// On Mac, modifiers are shown as symbols without separator
	// On Windows/Linux, use "+" as default separator
	const defaultSep = resolvedPlatform === "mac" ? "" : " + ";
	const sep = separator ?? defaultSep;

	const hotkeyClass = unstyled
		? className || undefined
		: ["hkd-hotkey", className].filter(Boolean).join(" ");

	return (
		<span className={hotkeyClass} aria-label={ariaLabel} role="img">
			{steps.map((stepKeys, stepIdx) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: steps are static per render
				<span key={stepIdx} aria-hidden="true">
					{stepIdx > 0 && (
						<span className={unstyled ? undefined : "hkd-sequence-arrow"} aria-hidden="true">
							{" → "}
						</span>
					)}
					{stepKeys.map((key, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: keys are static per render, index is stable
						<span key={`${key}-${i}`}>
							{i > 0 && sep && (
								<span className={unstyled ? undefined : "hkd-separator"}>{sep}</span>
							)}
							<Kbd variant={variant} size={size} unstyled={unstyled}>
								{key}
							</Kbd>
						</span>
					))}
				</span>
			))}
		</span>
	);
});
