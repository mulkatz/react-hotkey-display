import { useState } from "react";
import { ShortcutCheatsheet } from "react-hotkey-display";
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
		id: "new",
		combo: "Mod+N",
		description: "New file",
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
		id: "quick-open",
		combo: "Mod+P",
		description: "Quick open file",
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

interface CheatsheetProps {
	platform: Platform;
}

export function Cheatsheet({ platform }: CheatsheetProps) {
	const [open, setOpen] = useState(false);

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Shortcut Cheatsheet</h2>
			<p className="text-zinc-400 mb-8">
				Searchable, grouped overlay for all your keyboard shortcuts.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-center justify-center min-h-[200px]">
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="px-6 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium hover:bg-zinc-700 transition-colors"
					>
						Open Cheatsheet
					</button>
					<p className="mt-3 text-xs text-zinc-500">12 shortcuts across 4 categories</p>
				</div>

				<CodeBlock title="Cheatsheet.tsx">{`import {
  ShortcutCheatsheet,
  ShortcutProvider,
} from 'react-hotkey-display';
import 'react-hotkey-display/cheatsheet.css';

const shortcuts = [
  { id: 'save', combo: 'Mod+S',
    description: 'Save file', category: 'File' },
  { id: 'find', combo: 'Mod+F',
    description: 'Find', category: 'Search' },
  // ...
];

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>
        Shortcuts
      </button>
      <ShortcutCheatsheet
        open={open}
        onOpenChange={setOpen}
        shortcuts={shortcuts}
      />
    </>
  );
}`}</CodeBlock>
			</div>

			<ShortcutCheatsheet
				open={open}
				onOpenChange={setOpen}
				shortcuts={shortcuts}
				platform={platform}
				title="Keyboard Shortcuts"
			/>
		</section>
	);
}
