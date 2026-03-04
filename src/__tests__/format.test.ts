import { describe, expect, it } from "vitest";
import { formatCombo, formatKey, getAriaLabel, getComboAriaLabel, parseCombo } from "../format.js";

describe("parseCombo", () => {
	it('parses "Mod+K" into ["Mod", "K"]', () => {
		expect(parseCombo("Mod+K")).toEqual(["Mod", "K"]);
	});

	it('parses "Mod+Shift+K" into ["Mod", "Shift", "K"]', () => {
		expect(parseCombo("Mod+Shift+K")).toEqual(["Mod", "Shift", "K"]);
	});

	it('parses "Mod++" (trailing plus) into ["Mod", "+"]', () => {
		expect(parseCombo("Mod++")).toEqual(["Mod", "+"]);
	});

	it('parses "Mod+Shift++" into ["Mod", "Shift", "+"]', () => {
		expect(parseCombo("Mod+Shift++")).toEqual(["Mod", "Shift", "+"]);
	});

	it('parses standalone "+" into ["+"]', () => {
		expect(parseCombo("+")).toEqual(["+"]);
	});

	it("parses empty string into []", () => {
		expect(parseCombo("")).toEqual([]);
	});

	it("parses whitespace-only string into []", () => {
		expect(parseCombo("   ")).toEqual([]);
	});

	it('parses "Mod+Plus" into ["Mod", "Plus"]', () => {
		expect(parseCombo("Mod+Plus")).toEqual(["Mod", "Plus"]);
	});

	it('parses single key "F1" into ["F1"]', () => {
		expect(parseCombo("F1")).toEqual(["F1"]);
	});

	it('parses "Enter" into ["Enter"]', () => {
		expect(parseCombo("Enter")).toEqual(["Enter"]);
	});

	it("trims whitespace from combo", () => {
		expect(parseCombo("  Mod+K  ")).toEqual(["Mod", "K"]);
	});
});

describe("formatKey", () => {
	describe("mac platform", () => {
		it("formats Mod as Command symbol", () => {
			expect(formatKey("Mod", "mac")).toBe("\u2318");
		});

		it("formats Shift as shift symbol", () => {
			expect(formatKey("Shift", "mac")).toBe("\u21E7");
		});

		it("formats Alt as option symbol", () => {
			expect(formatKey("Alt", "mac")).toBe("\u2325");
		});

		it("formats Ctrl as control symbol", () => {
			expect(formatKey("Ctrl", "mac")).toBe("\u2303");
		});

		it("formats Enter as return symbol", () => {
			expect(formatKey("Enter", "mac")).toBe("\u23CE");
		});

		it("formats Escape as escape symbol", () => {
			expect(formatKey("Escape", "mac")).toBe("\u238B");
		});

		it("formats Tab as tab symbol", () => {
			expect(formatKey("Tab", "mac")).toBe("\u21E5");
		});

		it("formats Backspace as delete-left symbol", () => {
			expect(formatKey("Backspace", "mac")).toBe("\u232B");
		});

		it("formats Space as space symbol", () => {
			expect(formatKey("Space", "mac")).toBe("\u2423");
		});

		it("passes through F-keys", () => {
			expect(formatKey("F1", "mac")).toBe("F1");
			expect(formatKey("F12", "mac")).toBe("F12");
		});

		it("formats PageUp as readable label", () => {
			expect(formatKey("PageUp", "mac")).toBe("Page Up");
		});

		it("uppercases unknown keys", () => {
			expect(formatKey("a", "mac")).toBe("A");
			expect(formatKey("k", "mac")).toBe("K");
		});

		it("is case-insensitive for known keys", () => {
			expect(formatKey("mod", "mac")).toBe("\u2318");
			expect(formatKey("MOD", "mac")).toBe("\u2318");
			expect(formatKey("Mod", "mac")).toBe("\u2318");
		});
	});

	describe("windows platform", () => {
		it("formats Mod as Ctrl", () => {
			expect(formatKey("Mod", "windows")).toBe("Ctrl");
		});

		it("formats Shift as Shift", () => {
			expect(formatKey("Shift", "windows")).toBe("Shift");
		});

		it("formats Alt as Alt", () => {
			expect(formatKey("Alt", "windows")).toBe("Alt");
		});

		it("formats Enter as Enter", () => {
			expect(formatKey("Enter", "windows")).toBe("Enter");
		});

		it("formats Escape as Esc", () => {
			expect(formatKey("Escape", "windows")).toBe("Esc");
		});

		it("passes through F-keys", () => {
			expect(formatKey("F1", "windows")).toBe("F1");
		});

		it("uppercases unknown keys", () => {
			expect(formatKey("k", "windows")).toBe("K");
		});
	});

	describe("linux platform", () => {
		it("uses same labels as windows", () => {
			expect(formatKey("Mod", "linux")).toBe("Ctrl");
			expect(formatKey("Shift", "linux")).toBe("Shift");
		});
	});
});

describe("formatCombo", () => {
	it("formats Mod+K for mac", () => {
		expect(formatCombo("Mod+K", "mac")).toEqual(["\u2318", "K"]);
	});

	it("formats Mod+K for windows", () => {
		expect(formatCombo("Mod+K", "windows")).toEqual(["Ctrl", "K"]);
	});

	it("formats Mod+Shift+P for mac", () => {
		expect(formatCombo("Mod+Shift+P", "mac")).toEqual(["\u2318", "\u21E7", "P"]);
	});

	it("formats Mod+Shift+P for windows", () => {
		expect(formatCombo("Mod+Shift+P", "windows")).toEqual(["Ctrl", "Shift", "P"]);
	});

	it("returns empty array for empty combo", () => {
		expect(formatCombo("", "mac")).toEqual([]);
	});

	it("formats trailing plus correctly", () => {
		expect(formatCombo("Ctrl++", "mac")).toEqual(["\u2303", "+"]);
	});
});

describe("getAriaLabel", () => {
	it("returns human-readable label for Command symbol", () => {
		expect(getAriaLabel("\u2318")).toBe("Command");
	});

	it("returns human-readable label for Shift symbol", () => {
		expect(getAriaLabel("\u21E7")).toBe("Shift");
	});

	it("returns human-readable label for Option symbol", () => {
		expect(getAriaLabel("\u2325")).toBe("Option");
	});

	it("returns human-readable label for Enter symbol", () => {
		expect(getAriaLabel("\u23CE")).toBe("Enter");
	});

	it("returns human-readable label for Escape symbol", () => {
		expect(getAriaLabel("\u238B")).toBe("Escape");
	});

	it("passes through keys without special labels", () => {
		expect(getAriaLabel("K")).toBe("K");
		expect(getAriaLabel("Ctrl")).toBe("Ctrl");
	});
});

describe("getComboAriaLabel", () => {
	it("joins formatted keys with plus", () => {
		expect(getComboAriaLabel(["\u2318", "K"])).toBe("Command plus K");
	});

	it("resolves all symbols to human-readable names", () => {
		expect(getComboAriaLabel(["\u2318", "\u21E7", "P"])).toBe("Command plus Shift plus P");
	});

	it("handles single key", () => {
		expect(getComboAriaLabel(["K"])).toBe("K");
	});

	it("handles windows labels", () => {
		expect(getComboAriaLabel(["Ctrl", "K"])).toBe("Ctrl plus K");
	});
});
