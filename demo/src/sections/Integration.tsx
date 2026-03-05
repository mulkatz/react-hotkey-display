import { useState } from "react";

const tabs = [
	{
		id: "tanstack",
		label: "TanStack",
		code: `import { useQuery } from '@tanstack/react-query';
import { Hotkey, normalizeCombo } from 'react-hotkey-display';
import 'react-hotkey-display/styles.css';

// TanStack Router shortcut format: "mod+k"
const tanstackCombo = "mod+k";

// normalizeCombo converts to canonical format
const combo = normalizeCombo(tanstackCombo, "tanstack");
// → "Mod+K"

function SearchButton() {
  return (
    <button>
      Search <Hotkey combo={combo} variant="subtle" size="sm" />
    </button>
  );
}`,
	},
	{
		id: "hotkeys-hook",
		label: "react-hotkeys-hook",
		code: `import { useHotkeys } from 'react-hotkeys-hook';
import { Hotkey, normalizeCombo } from 'react-hotkey-display';
import 'react-hotkey-display/styles.css';

// react-hotkeys-hook format: "mod+shift+p"
const hookCombo = "mod+shift+p";

// Normalize to display format
const combo = normalizeCombo(hookCombo, "react-hotkeys-hook");
// → "Mod+Shift+P"

function CommandPalette() {
  useHotkeys(hookCombo, () => {
    // open palette...
  });

  return (
    <div>
      Press <Hotkey combo={combo} /> to open
    </div>
  );
}`,
	},
	{
		id: "tinykeys",
		label: "tinykeys",
		code: `import { tinykeys } from 'tinykeys';
import { Hotkey, normalizeCombo } from 'react-hotkey-display';
import 'react-hotkey-display/styles.css';

// tinykeys format: "\$mod+KeyK"
const tinykeyCombo = "\$mod+KeyK";

// Normalize to display format
const combo = normalizeCombo(tinykeyCombo, "tinykeys");
// → "Mod+K"

function App() {
  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [tinykeyCombo]: () => { /* handle */ },
    });
    return unsubscribe;
  }, []);

  return <Hotkey combo={combo} />;
}`,
	},
];

export function Integration() {
	const [activeTab, setActiveTab] = useState("tanstack");
	// biome-ignore lint/style/noNonNullAssertion: activeTab is always a valid tab id
	const active = tabs.find((t) => t.id === activeTab)!;

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Works With Any Hotkey Library</h2>
			<p className="text-zinc-400 mb-8">
				<code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
					normalizeCombo()
				</code>{" "}
				converts formats from popular libraries to the canonical display format.
			</p>

			<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
				<div className="flex border-b border-zinc-800">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`px-6 py-3 text-sm font-medium transition-colors ${
								activeTab === tab.id
									? "text-zinc-100 border-b-2 border-zinc-100 -mb-px"
									: "text-zinc-500 hover:text-zinc-300"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				<pre className="p-6 text-sm text-zinc-300 overflow-x-auto">
					<code>{active.code}</code>
				</pre>
			</div>
		</section>
	);
}
