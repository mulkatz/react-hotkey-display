import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Hotkey } from "../hotkey.js";

describe("Hotkey", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders correct keys for Mac platform", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		// The Command symbol and K should be rendered
		const group = screen.getByRole("group");
		expect(group).toBeDefined();
		expect(group.textContent).toContain("\u2318");
		expect(group.textContent).toContain("K");
	});

	it("renders correct keys for Windows platform", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("group");
		expect(group.textContent).toContain("Ctrl");
		expect(group.textContent).toContain("K");
	});

	it("returns null for empty combo", () => {
		const { container } = render(<Hotkey combo="" platform="mac" />);
		expect(container.innerHTML).toBe("");
	});

	it("returns null for whitespace-only combo", () => {
		const { container } = render(<Hotkey combo="   " platform="mac" />);
		expect(container.innerHTML).toBe("");
	});

	it('has role="group" on wrapper', () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("group");
		expect(group).toBeDefined();
	});

	it("has aria-label on the group", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("group");
		expect(group.getAttribute("aria-label")).toBe("Command plus K");
	});

	it("has aria-label with windows labels", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("group");
		expect(group.getAttribute("aria-label")).toBe("Ctrl plus K");
	});

	it("inner key spans have aria-hidden", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("group");
		const innerSpans = group.querySelectorAll(":scope > span");
		for (const span of innerSpans) {
			expect(span.getAttribute("aria-hidden")).toBe("true");
		}
	});

	it("applies variant class to kbd elements", () => {
		render(<Hotkey combo="Mod+K" platform="mac" variant="subtle" />);
		const group = screen.getByRole("group");
		const kbds = group.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-subtle");
		}
	});

	it("renders separator on Windows", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("group");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(1);
		expect(separators[0].textContent).toBe(" + ");
	});

	it("renders no separator on Mac by default", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("group");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(0);
	});

	it("uses custom separator when provided", () => {
		render(<Hotkey combo="Mod+K" platform="mac" separator=" / " />);
		const group = screen.getByRole("group");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(1);
		expect(separators[0].textContent).toBe(" / ");
	});

	it("applies additional className", () => {
		render(<Hotkey combo="Mod+K" platform="mac" className="custom" />);
		const group = screen.getByRole("group");
		expect(group.className).toContain("hkd-hotkey");
		expect(group.className).toContain("custom");
	});

	it("renders multiple modifier keys", () => {
		render(<Hotkey combo="Mod+Shift+K" platform="mac" />);
		const group = screen.getByRole("group");
		expect(group.textContent).toContain("\u2318");
		expect(group.textContent).toContain("\u21E7");
		expect(group.textContent).toContain("K");
	});

	it("handles standalone plus key combo", () => {
		render(<Hotkey combo="+" platform="mac" />);
		const group = screen.getByRole("group");
		expect(group.textContent).toContain("+");
	});
});
