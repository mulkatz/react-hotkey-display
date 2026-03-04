import { memo } from "react";
import { getAriaLabel } from "./format.js";
import type { KbdProps, KbdVariant } from "./types.js";

const variantClasses: Record<KbdVariant, string> = {
	subtle: "hkd-kbd hkd-subtle",
	elevated: "hkd-kbd hkd-elevated",
	flat: "hkd-kbd hkd-flat",
	outlined: "hkd-kbd hkd-outlined",
};

/** Single keyboard key display */
export const Kbd = memo(function Kbd({ children, variant = "elevated", className }: KbdProps) {
	const ariaLabel = getAriaLabel(children);
	const classes = [variantClasses[variant], className].filter(Boolean).join(" ");

	return (
		<kbd className={classes} aria-label={ariaLabel !== children ? ariaLabel : undefined}>
			{children}
		</kbd>
	);
});
