import { memo } from "react";
import { getAriaLabel } from "./format.js";
import type { KbdProps, KbdSize, KbdVariant } from "./types.js";

const variantClasses: Record<KbdVariant, string> = {
	subtle: "hkd-kbd hkd-subtle",
	elevated: "hkd-kbd hkd-elevated",
	flat: "hkd-kbd hkd-flat",
	outlined: "hkd-kbd hkd-outlined",
};

const sizeClasses: Record<KbdSize, string> = {
	sm: "hkd-sm",
	md: "",
	lg: "hkd-lg",
};

/** Single keyboard key display */
export const Kbd = memo(function Kbd({
	children,
	variant = "elevated",
	size = "md",
	unstyled = false,
	className,
}: KbdProps) {
	const ariaLabel = getAriaLabel(children);

	const classes = unstyled
		? className || undefined
		: [variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(" ");

	return (
		<kbd className={classes} aria-label={ariaLabel !== children ? ariaLabel : undefined}>
			{children}
		</kbd>
	);
});
