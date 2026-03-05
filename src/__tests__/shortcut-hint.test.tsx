import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ShortcutHint } from "../shortcut-hint.js";

describe("ShortcutHint", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders action label and shortcut", () => {
		render(<ShortcutHint action="Save" combo="Mod+S" platform="mac" />);
		expect(screen.getByText("Save")).toBeDefined();
		expect(screen.getByText("S")).toBeDefined();
	});

	it("applies hkd-hint wrapper class", () => {
		const { container } = render(<ShortcutHint action="Copy" combo="Mod+C" platform="mac" />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("hkd-hint");
	});

	it("applies hkd-hint-action class to action label", () => {
		render(<ShortcutHint action="Save" combo="Mod+S" platform="mac" />);
		const action = screen.getByText("Save");
		expect(action.className).toContain("hkd-hint-action");
	});

	it("passes variant to inner Hotkey", () => {
		render(<ShortcutHint action="Save" combo="Mod+S" platform="mac" variant="subtle" />);
		const kbds = document.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-subtle");
		}
	});

	it("strips hkd-* classes when unstyled", () => {
		const { container } = render(
			<ShortcutHint action="Save" combo="Mod+S" platform="mac" unstyled />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className || "").not.toContain("hkd-");
	});

	it("passes additional className", () => {
		const { container } = render(
			<ShortcutHint action="Save" combo="Mod+S" platform="mac" className="custom" />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("custom");
	});

	it("forwards size prop to inner Hotkey", () => {
		render(<ShortcutHint action="Save" combo="Mod+S" platform="mac" size="sm" />);
		const kbds = document.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-sm");
		}
	});

	it("forwards platform prop to inner Hotkey", () => {
		render(<ShortcutHint action="Save" combo="Mod+S" platform="windows" />);
		const img = screen.getByRole("img");
		expect(img.textContent).toContain("Ctrl");
	});
});
