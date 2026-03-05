import { useCallback, useState } from "react";
import { ShortcutPalette } from "react-hotkey-display";
import type { Platform, ShortcutEntry } from "react-hotkey-display";
import { CodeBlock } from "../components/CodeBlock";

const shortcuts: ShortcutEntry[] = [
	{ id: "save", combo: "Mod+S", description: "Save file", category: "File" },
	{
		id: "save-all",
		combo: "Mod+Shift+S",
		description: "Save all files",
		category: "File",
	},
	{
		id: "open",
		combo: "Mod+O",
		description: "Open file",
		category: "File",
	},
	{
		id: "find",
		combo: "Mod+F",
		description: "Find in file",
		category: "Search",
	},
	{
		id: "replace",
		combo: "Mod+H",
		description: "Find and replace",
		category: "Search",
	},
	{
		id: "find-files",
		combo: "Mod+Shift+F",
		description: "Search across files",
		category: "Search",
	},
	{
		id: "palette",
		combo: "Mod+Shift+P",
		description: "Command palette",
		category: "Navigation",
	},
	{
		id: "goto-line",
		combo: "Mod+G",
		description: "Go to line",
		category: "Navigation",
	},
	{
		id: "sidebar",
		combo: "Mod+B",
		description: "Toggle sidebar",
		category: "View",
	},
	{
		id: "terminal",
		combo: "Mod+`",
		description: "Toggle terminal",
		category: "View",
	},
];

interface PaletteProps {
	platform: Platform;
}

export function Palette({ platform }: PaletteProps) {
	const [open, setOpen] = useState(false);
	const [lastAction, setLastAction] = useState<string | null>(null);

	const handleSelect = useCallback((shortcut: ShortcutEntry) => {
		setLastAction(shortcut.description);
		setTimeout(() => setLastAction(null), 2000);
	}, []);

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Command Palette</h2>
			<p className="text-zinc-400 mb-8">
				Searchable command list with keyboard navigation. Arrow keys to navigate, Enter to select.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-center justify-center min-h-[200px] relative">
					<button
						type="button"
						onClick={() => setOpen(true)}
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

				<CodeBlock title="Palette.tsx">{`import { ShortcutPalette } from 'react-hotkey-display';
import 'react-hotkey-display/palette.css';

const shortcuts = [
  { id: 'save', combo: 'Mod+S',
    description: 'Save file', category: 'File' },
  // ...
];

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>
        Commands
      </button>
      <ShortcutPalette
        open={open}
        onOpenChange={setOpen}
        shortcuts={shortcuts}
        onSelect={(s) => console.log(s.id)}
        placeholder="Type a command..."
      />
    </>
  );
}`}</CodeBlock>
			</div>

			<ShortcutPalette
				open={open}
				onOpenChange={setOpen}
				shortcuts={shortcuts}
				onSelect={handleSelect}
				platform={platform}
				placeholder="Type a command..."
			/>
		</section>
	);
}
