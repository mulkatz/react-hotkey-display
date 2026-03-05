import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShortcutProvider } from "../shortcut-context.js";
import { ShortcutPalette } from "../shortcut-palette.js";
import type { ShortcutEntry } from "../types.js";

// Mock HTMLDialogElement methods (not available in jsdom)
beforeEach(() => {
	HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
		this.setAttribute("open", "");
	});
	HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
		this.removeAttribute("open");
	});
});

const shortcuts: ShortcutEntry[] = [
	{ id: "save", combo: "Mod+S", description: "Save", category: "File" },
	{ id: "open", combo: "Mod+O", description: "Open", category: "File" },
	{ id: "find", combo: "Mod+F", description: "Find", category: "Edit" },
	{ id: "replace", combo: "Mod+H", description: "Replace", category: "Edit" },
];

describe("ShortcutPalette", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a dialog element", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={false} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog).toBeDefined();
	});

	it("calls showModal when open is true", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
	});

	it("renders search input with placeholder", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const input = screen.getByPlaceholderText("Search commands...");
		expect(input).toBeDefined();
	});

	it("uses custom placeholder", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					placeholder="Type a command..."
				/>
			</ShortcutProvider>,
		);
		expect(screen.getByPlaceholderText("Type a command...")).toBeDefined();
	});

	it("renders all shortcut descriptions", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.getByText("Open")).toBeDefined();
		expect(screen.getByText("Find")).toBeDefined();
		expect(screen.getByText("Replace")).toBeDefined();
	});

	it("filters shortcuts by search", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search commands");
		fireEvent.change(input, { target: { value: "save" } });

		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.queryByText("Find")).toBeNull();
	});

	it("shows empty state when no matches", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search commands");
		fireEvent.change(input, { target: { value: "zzzzz" } });

		expect(screen.getByText("No commands found")).toBeDefined();
	});

	it("calls onSelect when Enter is pressed on active item", () => {
		const onSelect = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					onSelect={onSelect}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search commands");
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSelect).toHaveBeenCalledWith(shortcuts[0]);
	});

	it("navigates with ArrowDown and wraps around", () => {
		const onSelect = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					onSelect={onSelect}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search commands");

		// Move down once
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSelect).toHaveBeenCalledWith(shortcuts[1]);
	});

	it("navigates with ArrowUp", () => {
		const onSelect = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					onSelect={onSelect}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search commands");

		// ArrowUp from 0 wraps to last
		fireEvent.keyDown(input, { key: "ArrowUp" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSelect).toHaveBeenCalledWith(shortcuts[shortcuts.length - 1]);
	});

	it("calls onSelect when item is clicked", () => {
		const onSelect = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					onSelect={onSelect}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		fireEvent.click(screen.getByText("Find"));
		expect(onSelect).toHaveBeenCalledWith(shortcuts[2]);
	});

	it("has ARIA combobox role on input", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const input = screen.getByRole("combobox");
		expect(input).toBeDefined();
	});

	it("applies hkd-palette class to dialog", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog?.className).toContain("hkd-palette");
	});

	it("strips hkd-* classes when unstyled", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} unstyled />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog?.className || "").not.toContain("hkd-");
	});

	it("reads shortcuts from provider when no prop given", () => {
		render(
			<ShortcutProvider shortcuts={shortcuts}>
				<ShortcutPalette open={true} onOpenChange={() => {}} platform="windows" />
			</ShortcutProvider>,
		);
		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.getByText("Find")).toBeDefined();
	});

	it("calls onOpenChange(false) when item is selected via Enter", () => {
		const onOpenChange = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={onOpenChange}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		const input = screen.getByLabelText("Search commands");
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("calls onOpenChange(false) when item is clicked", () => {
		const onOpenChange = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={onOpenChange}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		fireEvent.click(screen.getByText("Find"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("calls onOpenChange(false) on native dialog close event", () => {
		const onOpenChange = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={onOpenChange} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		fireEvent(dialog as Element, new Event("close"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("filters shortcuts by category", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		const input = screen.getByLabelText("Search commands");
		fireEvent.change(input, { target: { value: "Edit" } });
		expect(screen.getByText("Find")).toBeDefined();
		expect(screen.getByText("Replace")).toBeDefined();
		expect(screen.queryByText("Save")).toBeNull();
	});

	it("filters shortcuts by combo string", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		const input = screen.getByLabelText("Search commands");
		fireEvent.change(input, { target: { value: "mod+f" } });
		expect(screen.getByText("Find")).toBeDefined();
		expect(screen.queryByText("Save")).toBeNull();
	});

	it("has aria-label on dialog", () => {
		render(
			<ShortcutProvider>
				<ShortcutPalette open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog?.getAttribute("aria-label")).toBe("Command palette");
	});
});
