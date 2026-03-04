import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Kbd } from "../kbd.js";

describe("Kbd", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a <kbd> element", () => {
		render(<Kbd>K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.tagName).toBe("KBD");
	});

	it("renders children text", () => {
		render(<Kbd>Enter</Kbd>);
		expect(screen.getByText("Enter")).toBeDefined();
	});

	it("applies default elevated variant class", () => {
		render(<Kbd>K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.className).toContain("hkd-kbd");
		expect(kbd.className).toContain("hkd-elevated");
	});

	it("applies subtle variant class", () => {
		render(<Kbd variant="subtle">K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.className).toContain("hkd-subtle");
	});

	it("applies flat variant class", () => {
		render(<Kbd variant="flat">K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.className).toContain("hkd-flat");
	});

	it("applies outlined variant class", () => {
		render(<Kbd variant="outlined">K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.className).toContain("hkd-outlined");
	});

	it("adds additional className", () => {
		render(<Kbd className="custom">K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.className).toContain("custom");
	});

	it("adds aria-label for symbol keys", () => {
		render(<Kbd>{"\u2318"}</Kbd>);
		const kbd = screen.getByLabelText("Command");
		expect(kbd).toBeDefined();
	});

	it("does not add aria-label for regular text keys", () => {
		render(<Kbd>K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.getAttribute("aria-label")).toBeNull();
	});
});
