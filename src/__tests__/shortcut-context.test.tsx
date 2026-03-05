import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	ShortcutProvider,
	useContextShortcuts,
	useRegisterShortcut,
	useShortcuts,
} from "../shortcut-context.js";
import type { ShortcutEntry } from "../types.js";

function ShortcutDisplay() {
	const shortcuts = useShortcuts();
	return (
		<ul>
			{shortcuts.map((s) => (
				<li key={s.id} data-testid={s.id}>
					{s.description}
				</li>
			))}
		</ul>
	);
}

function DynamicShortcut({ entry }: { entry: ShortcutEntry }) {
	useRegisterShortcut(entry);
	return null;
}

describe("ShortcutProvider + useShortcuts", () => {
	afterEach(() => {
		cleanup();
	});

	it("provides shortcuts to consumers", () => {
		const shortcuts: ShortcutEntry[] = [{ id: "save", combo: "Mod+S", description: "Save" }];

		render(
			<ShortcutProvider shortcuts={shortcuts}>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("save")).toBeDefined();
		expect(screen.getByText("Save")).toBeDefined();
	});

	it("provides multiple shortcuts", () => {
		const shortcuts: ShortcutEntry[] = [
			{ id: "save", combo: "Mod+S", description: "Save" },
			{ id: "copy", combo: "Mod+C", description: "Copy" },
		];

		render(
			<ShortcutProvider shortcuts={shortcuts}>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("save")).toBeDefined();
		expect(screen.getByTestId("copy")).toBeDefined();
	});

	it("renders empty when no shortcuts provided", () => {
		render(
			<ShortcutProvider>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		const items = screen.queryAllByRole("listitem");
		expect(items.length).toBe(0);
	});

	it("throws when useShortcuts used outside provider", () => {
		expect(() => {
			render(<ShortcutDisplay />);
		}).toThrow("useShortcuts must be used within a <ShortcutProvider>");
	});
});

describe("useRegisterShortcut", () => {
	afterEach(() => {
		cleanup();
	});

	it("dynamically registers a shortcut", () => {
		const entry: ShortcutEntry = {
			id: "find",
			combo: "Mod+F",
			description: "Find",
		};

		render(
			<ShortcutProvider>
				<DynamicShortcut entry={entry} />
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("find")).toBeDefined();
		expect(screen.getByText("Find")).toBeDefined();
	});

	it("unregisters shortcut on unmount", () => {
		const entry: ShortcutEntry = {
			id: "find",
			combo: "Mod+F",
			description: "Find",
		};

		const { rerender } = render(
			<ShortcutProvider>
				<DynamicShortcut entry={entry} />
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("find")).toBeDefined();

		// Rerender without the dynamic shortcut
		rerender(
			<ShortcutProvider>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.queryByTestId("find")).toBeNull();
	});

	it("throws when used outside provider", () => {
		const entry: ShortcutEntry = {
			id: "test",
			combo: "Mod+T",
			description: "Test",
		};

		expect(() => {
			render(<DynamicShortcut entry={entry} />);
		}).toThrow("useRegisterShortcut must be used within a <ShortcutProvider>");
	});
});

describe("ShortcutProvider re-render", () => {
	afterEach(() => {
		cleanup();
	});

	it("updates when shortcuts prop changes", () => {
		const initial: ShortcutEntry[] = [{ id: "save", combo: "Mod+S", description: "Save" }];
		const updated: ShortcutEntry[] = [
			{ id: "save", combo: "Mod+S", description: "Save" },
			{ id: "copy", combo: "Mod+C", description: "Copy" },
		];

		const { rerender } = render(
			<ShortcutProvider shortcuts={initial}>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("save")).toBeDefined();
		expect(screen.queryByTestId("copy")).toBeNull();

		rerender(
			<ShortcutProvider shortcuts={updated}>
				<ShortcutDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("save")).toBeDefined();
		expect(screen.getByTestId("copy")).toBeDefined();
	});
});

describe("useContextShortcuts", () => {
	afterEach(() => {
		cleanup();
	});

	it("returns empty array outside provider without throwing", () => {
		function ContextDisplay() {
			const shortcuts = useContextShortcuts();
			return <span data-testid="count">{shortcuts.length}</span>;
		}

		render(<ContextDisplay />);
		expect(screen.getByTestId("count").textContent).toBe("0");
	});

	it("reads from context store when no prop given", () => {
		const ctxShortcuts: ShortcutEntry[] = [
			{ id: "ctx", combo: "Mod+C", description: "From context" },
		];

		function ContextDisplay() {
			const shortcuts = useContextShortcuts();
			return <span data-testid="count">{shortcuts.length}</span>;
		}

		render(
			<ShortcutProvider shortcuts={ctxShortcuts}>
				<ContextDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("count").textContent).toBe("1");
	});

	it("prefers prop shortcuts over context", () => {
		const propShortcuts: ShortcutEntry[] = [
			{ id: "prop", combo: "Mod+P", description: "From prop" },
		];
		const ctxShortcuts: ShortcutEntry[] = [
			{ id: "ctx", combo: "Mod+C", description: "From context" },
		];

		function ContextDisplay() {
			const shortcuts = useContextShortcuts(propShortcuts);
			return (
				<ul>
					{shortcuts.map((s) => (
						<li key={s.id} data-testid={s.id}>
							{s.description}
						</li>
					))}
				</ul>
			);
		}

		render(
			<ShortcutProvider shortcuts={ctxShortcuts}>
				<ContextDisplay />
			</ShortcutProvider>,
		);

		expect(screen.getByTestId("prop")).toBeDefined();
		expect(screen.queryByTestId("ctx")).toBeNull();
	});
});
