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
		const group = screen.getByRole("img");
		expect(group).toBeDefined();
		expect(group.textContent).toContain("\u2318");
		expect(group.textContent).toContain("K");
	});

	it("renders correct keys for Windows platform", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("img");
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

	it('has role="img" on wrapper', () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const img = screen.getByRole("img");
		expect(img).toBeDefined();
	});

	it("has aria-label on the group", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("img");
		expect(group.getAttribute("aria-label")).toBe("Command plus K");
	});

	it("has aria-label with windows labels", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("img");
		expect(group.getAttribute("aria-label")).toBe("Ctrl plus K");
	});

	it("inner key spans have aria-hidden", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("img");
		const innerSpans = group.querySelectorAll(":scope > span");
		for (const span of innerSpans) {
			expect(span.getAttribute("aria-hidden")).toBe("true");
		}
	});

	it("applies variant class to kbd elements", () => {
		render(<Hotkey combo="Mod+K" platform="mac" variant="subtle" />);
		const group = screen.getByRole("img");
		const kbds = group.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-subtle");
		}
	});

	it("renders separator on Windows", () => {
		render(<Hotkey combo="Mod+K" platform="windows" />);
		const group = screen.getByRole("img");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(1);
		expect(separators[0].textContent).toBe(" + ");
	});

	it("renders no separator on Mac by default", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const group = screen.getByRole("img");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(0);
	});

	it("uses custom separator when provided", () => {
		render(<Hotkey combo="Mod+K" platform="mac" separator=" / " />);
		const group = screen.getByRole("img");
		const separators = group.querySelectorAll(".hkd-separator");
		expect(separators.length).toBe(1);
		expect(separators[0].textContent).toBe(" / ");
	});

	it("applies additional className", () => {
		render(<Hotkey combo="Mod+K" platform="mac" className="custom" />);
		const group = screen.getByRole("img");
		expect(group.className).toContain("hkd-hotkey");
		expect(group.className).toContain("custom");
	});

	it("renders multiple modifier keys", () => {
		render(<Hotkey combo="Mod+Shift+K" platform="mac" />);
		const group = screen.getByRole("img");
		expect(group.textContent).toContain("\u2318");
		expect(group.textContent).toContain("\u21E7");
		expect(group.textContent).toContain("K");
	});

	it("handles standalone plus key combo", () => {
		render(<Hotkey combo="+" platform="mac" />);
		const group = screen.getByRole("img");
		expect(group.textContent).toContain("+");
	});

	it("renders sequence combos with arrow separator", () => {
		render(<Hotkey combo="G G" platform="mac" />);
		const group = screen.getByRole("img");
		expect(group.textContent).toContain("G");
		expect(group.textContent).toContain("→");
	});

	it("has 'then' in aria-label for sequences", () => {
		render(<Hotkey combo="G G" platform="mac" />);
		const group = screen.getByRole("img");
		expect(group.getAttribute("aria-label")).toBe("G then G");
	});

	it("applies size class to kbd elements", () => {
		render(<Hotkey combo="Mod+K" platform="mac" size="sm" />);
		const kbds = document.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-sm");
		}
	});

	it("strips hkd-* classes when unstyled", () => {
		render(<Hotkey combo="Mod+K" platform="mac" unstyled />);
		const group = screen.getByRole("img");
		expect(group.className || "").not.toContain("hkd-");
		const kbds = group.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className || "").not.toContain("hkd-");
		}
	});

	it("applies large size class to kbd elements", () => {
		render(<Hotkey combo="Mod+K" platform="mac" size="lg" />);
		const kbds = document.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).toContain("hkd-lg");
		}
	});

	it("does not add size class for md (default)", () => {
		render(<Hotkey combo="Mod+K" platform="mac" />);
		const kbds = document.querySelectorAll("kbd");
		for (const kbd of kbds) {
			expect(kbd.className).not.toContain("hkd-sm");
			expect(kbd.className).not.toContain("hkd-lg");
		}
	});
});
