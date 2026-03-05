import { memo } from "react";
import { Hotkey } from "./hotkey.js";
import type { ShortcutHintProps } from "./types.js";

/** Display an action label paired with its keyboard shortcut */
export const ShortcutHint = memo(function ShortcutHint({
	action,
	combo,
	platform,
	variant = "elevated",
	size = "md",
	unstyled = false,
	className,
}: ShortcutHintProps) {
	const wrapperClass = unstyled
		? className || undefined
		: ["hkd-hint", className].filter(Boolean).join(" ");

	return (
		<span className={wrapperClass}>
			<span className={unstyled ? undefined : "hkd-hint-action"}>{action}</span>
			<Hotkey combo={combo} platform={platform} variant={variant} size={size} unstyled={unstyled} />
		</span>
	);
});
