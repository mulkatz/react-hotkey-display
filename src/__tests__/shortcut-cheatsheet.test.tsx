import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShortcutCheatsheet } from "../shortcut-cheatsheet.js";
import { ShortcutProvider } from "../shortcut-context.js";
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

describe("ShortcutCheatsheet", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a dialog element", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={false} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog).toBeDefined();
	});

	it("calls showModal when open is true", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
	});

	it("displays title", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		expect(screen.getByText("Keyboard Shortcuts")).toBeDefined();
	});

	it("uses custom title", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					title="App Shortcuts"
				/>
			</ShortcutProvider>,
		);
		expect(screen.getByText("App Shortcuts")).toBeDefined();
	});

	it("groups shortcuts by category", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		expect(screen.getByText("File")).toBeDefined();
		expect(screen.getByText("Edit")).toBeDefined();
	});

	it("renders all shortcut descriptions", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
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
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search shortcuts");
		fireEvent.change(input, { target: { value: "save" } });

		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.queryByText("Find")).toBeNull();
	});

	it("shows empty state when no matches", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);

		const input = screen.getByLabelText("Search shortcuts");
		fireEvent.change(input, { target: { value: "zzzzz" } });

		expect(screen.getByText("No shortcuts found")).toBeDefined();
	});

	it("calls onOpenChange(false) when close button clicked", () => {
		const onOpenChange = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={onOpenChange} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);

		const closeBtn = screen.getByLabelText("Close");
		fireEvent.click(closeBtn);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("applies hkd-cheatsheet class to dialog", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog?.className).toContain("hkd-cheatsheet");
	});

	it("strips hkd-* classes when unstyled", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} unstyled />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		expect(dialog?.className || "").not.toContain("hkd-");
	});

	it("reads shortcuts from provider when no prop given", () => {
		render(
			<ShortcutProvider shortcuts={shortcuts}>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} platform="windows" />
			</ShortcutProvider>,
		);
		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.getByText("Find")).toBeDefined();
	});

	it("groups uncategorized shortcuts under General", () => {
		const uncategorized: ShortcutEntry[] = [{ id: "help", combo: "F1", description: "Help" }];
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={uncategorized}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		expect(screen.getByText("General")).toBeDefined();
		expect(screen.getByText("Help")).toBeDefined();
	});

	it("calls onOpenChange(false) on native dialog close event", () => {
		const onOpenChange = vi.fn();
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={onOpenChange} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		fireEvent(dialog as Element, new Event("close"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("filters shortcuts by category", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		const input = screen.getByLabelText("Search shortcuts");
		fireEvent.change(input, { target: { value: "Edit" } });
		expect(screen.getByText("Find")).toBeDefined();
		expect(screen.getByText("Replace")).toBeDefined();
		expect(screen.queryByText("Save")).toBeNull();
	});

	it("filters shortcuts by combo string", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet
					open={true}
					onOpenChange={() => {}}
					shortcuts={shortcuts}
					platform="windows"
				/>
			</ShortcutProvider>,
		);
		const input = screen.getByLabelText("Search shortcuts");
		fireEvent.change(input, { target: { value: "mod+f" } });
		expect(screen.getByText("Find")).toBeDefined();
		expect(screen.queryByText("Save")).toBeNull();
	});

	it("has aria-labelledby on dialog pointing to title", () => {
		render(
			<ShortcutProvider>
				<ShortcutCheatsheet open={true} onOpenChange={() => {}} shortcuts={shortcuts} />
			</ShortcutProvider>,
		);
		const dialog = document.querySelector("dialog");
		const labelledBy = dialog?.getAttribute("aria-labelledby");
		expect(labelledBy).toBeTruthy();
		const title = document.getElementById(labelledBy as string);
		expect(title?.textContent).toBe("Keyboard Shortcuts");
	});
});
