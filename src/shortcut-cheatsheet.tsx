import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Hotkey } from "./hotkey.js";
import { useContextShortcuts } from "./shortcut-context.js";
import type { ShortcutCheatsheetProps, ShortcutEntry } from "./types.js";

/** Group shortcuts by category */
function groupByCategory(shortcuts: ShortcutEntry[]): Map<string, ShortcutEntry[]> {
	const groups = new Map<string, ShortcutEntry[]>();
	for (const shortcut of shortcuts) {
		const category = shortcut.category || "General";
		const group = groups.get(category);
		if (group) {
			group.push(shortcut);
		} else {
			groups.set(category, [shortcut]);
		}
	}
	return groups;
}

/** Keyboard shortcut cheatsheet overlay using the native <dialog> element */
export const ShortcutCheatsheet = memo(function ShortcutCheatsheet({
	open,
	onOpenChange,
	shortcuts: shortcutsProp,
	title = "Keyboard Shortcuts",
	variant = "elevated",
	size = "sm",
	platform,
	unstyled = false,
	className,
}: ShortcutCheatsheetProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const [search, setSearch] = useState("");

	const shortcuts = useContextShortcuts(shortcutsProp);

	// Sync dialog open state
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
			setSearch("");
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	// Handle native close (Escape key, backdrop click)
	const handleClose = useCallback(() => {
		onOpenChange(false);
	}, [onOpenChange]);

	// Handle backdrop click via native dialog click target detection
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleBackdropClick = (e: MouseEvent) => {
			if (e.target === dialog) {
				onOpenChange(false);
			}
		};

		dialog.addEventListener("click", handleBackdropClick);
		return () => dialog.removeEventListener("click", handleBackdropClick);
	}, [onOpenChange]);

	const filtered = useMemo(() => {
		if (!search.trim()) return shortcuts;
		const q = search.toLowerCase();
		return shortcuts.filter(
			(s) =>
				s.description.toLowerCase().includes(q) ||
				s.combo.toLowerCase().includes(q) ||
				s.category?.toLowerCase().includes(q),
		);
	}, [shortcuts, search]);

	const groups = useMemo(() => groupByCategory(filtered), [filtered]);

	const dialogClass = unstyled
		? className || undefined
		: ["hkd-cheatsheet", className].filter(Boolean).join(" ");

	return (
		<dialog ref={dialogRef} className={dialogClass} onClose={handleClose} aria-labelledby={titleId}>
			<div className={unstyled ? undefined : "hkd-cheatsheet-content"}>
				<header className={unstyled ? undefined : "hkd-cheatsheet-header"}>
					<h2 id={titleId} className={unstyled ? undefined : "hkd-cheatsheet-title"}>
						{title}
					</h2>
					<button
						type="button"
						className={unstyled ? undefined : "hkd-cheatsheet-close"}
						onClick={() => onOpenChange(false)}
						aria-label="Close"
					>
						{"\u00D7"}
					</button>
				</header>
				<div className={unstyled ? undefined : "hkd-cheatsheet-search"}>
					<input
						type="text"
						placeholder="Search shortcuts..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={unstyled ? undefined : "hkd-cheatsheet-input"}
						aria-label="Search shortcuts"
					/>
				</div>
				<div className={unstyled ? undefined : "hkd-cheatsheet-body"}>
					{groups.size === 0 && (
						<p className={unstyled ? undefined : "hkd-cheatsheet-empty"}>No shortcuts found</p>
					)}
					{Array.from(groups.entries()).map(([category, items]) => (
						<section key={category} className={unstyled ? undefined : "hkd-cheatsheet-group"}>
							<h3 className={unstyled ? undefined : "hkd-cheatsheet-category"}>{category}</h3>
							<ul className={unstyled ? undefined : "hkd-cheatsheet-list"}>
								{items.map((shortcut) => (
									<li key={shortcut.id} className={unstyled ? undefined : "hkd-cheatsheet-item"}>
										<span className={unstyled ? undefined : "hkd-cheatsheet-desc"}>
											{shortcut.description}
										</span>
										<Hotkey
											combo={shortcut.combo}
											platform={platform}
											variant={variant}
											size={size}
											unstyled={unstyled}
										/>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</div>
		</dialog>
	);
});
