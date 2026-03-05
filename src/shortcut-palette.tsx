import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Hotkey } from "./hotkey.js";
import { useContextShortcuts } from "./shortcut-context.js";
import type { ShortcutEntry, ShortcutPaletteProps } from "./types.js";

/** Command palette for searching and executing keyboard shortcuts */
export const ShortcutPalette = memo(function ShortcutPalette({
	open,
	onOpenChange,
	onSelect,
	shortcuts: shortcutsProp,
	placeholder = "Search commands...",
	variant = "elevated",
	size = "sm",
	platform,
	unstyled = false,
	className,
}: ShortcutPaletteProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const listboxId = useId();

	const shortcuts = useContextShortcuts(shortcutsProp);

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

	// Sync dialog open state
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
			setSearch("");
			setActiveIndex(0);
			// Focus input after dialog opens
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	// Reset active index when filtered results change
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on every filter change
	useEffect(() => {
		setActiveIndex(0);
	}, [filtered]);

	// Handle native close
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

	// Select a shortcut
	const handleSelect = useCallback(
		(shortcut: ShortcutEntry) => {
			onOpenChange(false);
			onSelect?.(shortcut);
		},
		[onOpenChange, onSelect],
	);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex(
						(prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1),
					);
					break;
				case "Enter":
					e.preventDefault();
					if (filtered[activeIndex]) {
						handleSelect(filtered[activeIndex]);
					}
					break;
			}
		},
		[filtered, activeIndex, handleSelect],
	);

	// Scroll active item into view
	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const activeItem = list.children[activeIndex] as HTMLElement | undefined;
		if (typeof activeItem?.scrollIntoView === "function") {
			activeItem.scrollIntoView({ block: "nearest" });
		}
	}, [activeIndex]);

	const activeOptionId = filtered[activeIndex] ? `${listboxId}-option-${activeIndex}` : undefined;

	const dialogClass = unstyled
		? className || undefined
		: ["hkd-palette", className].filter(Boolean).join(" ");

	return (
		<dialog
			ref={dialogRef}
			className={dialogClass}
			onClose={handleClose}
			aria-label="Command palette"
		>
			<div className={unstyled ? undefined : "hkd-palette-content"}>
				<div className={unstyled ? undefined : "hkd-palette-search"}>
					<input
						ref={inputRef}
						type="text"
						role="combobox"
						placeholder={placeholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={handleKeyDown}
						className={unstyled ? undefined : "hkd-palette-input"}
						aria-label="Search commands"
						aria-autocomplete="list"
						aria-controls={listboxId}
						aria-expanded={open && filtered.length > 0}
						aria-activedescendant={activeOptionId}
					/>
				</div>
				{filtered.length === 0 && (
					<div className={unstyled ? undefined : "hkd-palette-empty"} role="status">
						No commands found
					</div>
				)}
				<div
					ref={listRef}
					id={listboxId}
					role="listbox"
					tabIndex={-1}
					className={unstyled ? undefined : "hkd-palette-list"}
					aria-label="Commands"
				>
					{filtered.map((shortcut, index) => (
						<div
							key={shortcut.id}
							id={`${listboxId}-option-${index}`}
							role="option"
							tabIndex={-1}
							aria-selected={index === activeIndex}
							className={
								unstyled
									? undefined
									: ["hkd-palette-item", index === activeIndex ? "hkd-palette-active" : ""]
											.filter(Boolean)
											.join(" ")
							}
							onClick={() => handleSelect(shortcut)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSelect(shortcut);
							}}
							onMouseEnter={() => setActiveIndex(index)}
						>
							<span className={unstyled ? undefined : "hkd-palette-item-info"}>
								<span className={unstyled ? undefined : "hkd-palette-item-desc"}>
									{shortcut.description}
								</span>
								{shortcut.category && (
									<span className={unstyled ? undefined : "hkd-palette-item-cat"}>
										{shortcut.category}
									</span>
								)}
							</span>
							<Hotkey
								combo={shortcut.combo}
								platform={platform}
								variant={variant}
								size={size}
								unstyled={unstyled}
							/>
						</div>
					))}
				</div>
			</div>
		</dialog>
	);
});
