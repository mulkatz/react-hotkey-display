import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { detectPlatform, resetPlatformCache } from "../detect-os.js";

describe("detectPlatform", () => {
	beforeEach(() => {
		resetPlatformCache();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		resetPlatformCache();
	});

	it("detects Mac via userAgentData.platform", () => {
		vi.stubGlobal("navigator", {
			userAgentData: { platform: "macOS" },
			userAgent: "",
			platform: "",
		});
		expect(detectPlatform()).toBe("mac");
	});

	it("detects Mac via navigator.platform", () => {
		vi.stubGlobal("navigator", {
			userAgent: "",
			platform: "MacIntel",
		});
		expect(detectPlatform()).toBe("mac");
	});

	it("detects Mac via userAgent string", () => {
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			platform: "",
		});
		expect(detectPlatform()).toBe("mac");
	});

	it("detects Windows as default", () => {
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			platform: "Win32",
		});
		expect(detectPlatform()).toBe("windows");
	});

	it("detects Linux via platform", () => {
		vi.stubGlobal("navigator", {
			userAgent: "",
			platform: "Linux x86_64",
		});
		expect(detectPlatform()).toBe("linux");
	});

	it("detects Linux via userAgent", () => {
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
			platform: "",
		});
		expect(detectPlatform()).toBe("linux");
	});

	it("detects Android as linux", () => {
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (Linux; Android 13)",
			platform: "Linux armv8l",
		});
		expect(detectPlatform()).toBe("linux");
	});

	it("falls back to windows for unknown platforms", () => {
		vi.stubGlobal("navigator", {
			userAgent: "SomeUnknownBrowser/1.0",
			platform: "Unknown",
		});
		expect(detectPlatform()).toBe("windows");
	});

	it("returns windows when navigator is undefined (SSR)", () => {
		vi.stubGlobal("navigator", undefined);
		expect(detectPlatform()).toBe("windows");
	});

	it("caches the detected platform", () => {
		vi.stubGlobal("navigator", {
			userAgent: "",
			platform: "MacIntel",
		});
		expect(detectPlatform()).toBe("mac");

		// Change navigator — should still return cached value
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (Windows NT 10.0)",
			platform: "Win32",
		});
		expect(detectPlatform()).toBe("mac");
	});

	it("resetPlatformCache clears the cache", () => {
		vi.stubGlobal("navigator", {
			userAgent: "",
			platform: "MacIntel",
		});
		expect(detectPlatform()).toBe("mac");

		resetPlatformCache();

		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 (Windows NT 10.0)",
			platform: "Win32",
		});
		expect(detectPlatform()).toBe("windows");
	});
});
