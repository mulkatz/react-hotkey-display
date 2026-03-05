import { useCallback, useState } from "react";
import { ShortcutCheatsheet, ShortcutPalette } from "react-hotkey-display";
import type { Platform, ShortcutEntry } from "react-hotkey-display";
import { CodeBlock } from "../components/CodeBlock";

const shortcuts: ShortcutEntry[] = [
	{ id: "save", combo: "Mod+S", description: "Save file", category: "File" },
	{ id: "save-all", combo: "Mod+Shift+S", description: "Save all files", category: "File" },
	{ id: "open", combo: "Mod+O", description: "Open file", category: "File" },
	{ id: "new", combo: "Mod+N", description: "New file", category: "File" },
	{ id: "find", combo: "Mod+F", description: "Find in file", category: "Search" },
	{ id: "replace", combo: "Mod+H", description: "Find and replace", category: "Search" },
	{
		id: "find-files",
		combo: "Mod+Shift+F",
		description: "Search across files",
		category: "Search",
	},
	{ id: "palette", combo: "Mod+Shift+P", description: "Command palette", category: "Navigation" },
	{ id: "goto-line", combo: "Mod+G", description: "Go to line", category: "Navigation" },
	{ id: "quick-open", combo: "Mod+P", description: "Quick open file", category: "Navigation" },
	{ id: "sidebar", combo: "Mod+B", description: "Toggle sidebar", category: "View" },
	{ id: "terminal", combo: "Mod+`", description: "Toggle terminal", category: "View" },
];

interface OverlaysProps {
	platform: Platform;
}

export function Overlays({ platform }: OverlaysProps) {
	const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [lastAction, setLastAction] = useState<string | null>(null);

	const handleSelect = useCallback((shortcut: ShortcutEntry) => {
		setLastAction(shortcut.description);
		setTimeout(() => setLastAction(null), 2000);
	}, []);

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Overlays</h2>
			<p className="text-zinc-400 mb-12">
				Two ready-made overlays for keyboard shortcut discovery.
			</p>

			{/* Two-column comparison */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Cheatsheet */}
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
					<h3 className="text-lg font-semibold text-zinc-200 mb-1">Cheatsheet</h3>
					<p className="text-sm text-zinc-400 mb-6">
						Read-only reference grouped by category. Searchable.
					</p>
					<div className="flex-1 flex flex-col items-center justify-center min-h-[120px]">
						<button
							type="button"
							onClick={() => setCheatsheetOpen(true)}
							className="px-6 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium hover:bg-zinc-700 transition-colors"
						>
							Open Cheatsheet
						</button>
						<p className="mt-3 text-xs text-zinc-500">12 shortcuts across 4 categories</p>
					</div>
				</div>

				{/* Palette */}
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
					<h3 className="text-lg font-semibold text-zinc-200 mb-1">Command Palette</h3>
					<p className="text-sm text-zinc-400 mb-6">
						Actionable command list with keyboard navigation. Arrow keys + Enter.
					</p>
					<div className="flex-1 flex flex-col items-center justify-center min-h-[120px] relative">
						<button
							type="button"
							onClick={() => setPaletteOpen(true)}
							className="px-6 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium hover:bg-zinc-700 transition-colors"
						>
							Open Command Palette
						</button>
						<p className="mt-3 text-xs text-zinc-500">Try searching, arrow keys, and Enter</p>

						{lastAction && (
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 animate-fade-in">
								Executed: {lastAction}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Shared code snippet */}
			<CodeBlock title="Overlays.tsx">{`import {
  ShortcutCheatsheet,
  ShortcutPalette,
} from 'react-hotkey-display';
import 'react-hotkey-display/cheatsheet.css';
import 'react-hotkey-display/palette.css';

const shortcuts = [
  { id: 'save', combo: 'Mod+S',
    description: 'Save file', category: 'File' },
  { id: 'find', combo: 'Mod+F',
    description: 'Find', category: 'Search' },
  // ...
];

// Cheatsheet — read-only reference
<ShortcutCheatsheet
  open={open}
  onOpenChange={setOpen}
  shortcuts={shortcuts}
/>

// Palette — actionable, with keyboard nav
<ShortcutPalette
  open={open}
  onOpenChange={setOpen}
  shortcuts={shortcuts}
  onSelect={(s) => console.log(s.id)}
  placeholder="Type a command..."
/>`}</CodeBlock>

			<ShortcutCheatsheet
				open={cheatsheetOpen}
				onOpenChange={setCheatsheetOpen}
				shortcuts={shortcuts}
				platform={platform}
				title="Keyboard Shortcuts"
			/>

			<ShortcutPalette
				open={paletteOpen}
				onOpenChange={setPaletteOpen}
				shortcuts={shortcuts}
				onSelect={handleSelect}
				platform={platform}
				placeholder="Type a command..."
			/>
		</section>
	);
}
