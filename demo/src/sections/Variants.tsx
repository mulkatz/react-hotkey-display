import { Hotkey, Kbd, ShortcutHint } from "react-hotkey-display";
import type { KbdSize, KbdVariant, Platform } from "react-hotkey-display";
import { CodeBlock } from "../components/CodeBlock";

interface VariantsProps {
	platform: Platform;
}

const variants: KbdVariant[] = ["elevated", "subtle", "flat", "outlined"];
const sizes: KbdSize[] = ["sm", "md", "lg"];

export function Variants({ platform }: VariantsProps) {
	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Components</h2>
			<p className="text-zinc-400 mb-12">
				Five components, three sizes, four themes. All OS-aware.
			</p>

			{/* Kbd */}
			<div className="mb-16">
				<h3 className="text-xl font-semibold text-zinc-200 mb-1">{"<Kbd>"}</h3>
				<p className="text-sm text-zinc-500 mb-6">Single key display with keycap styling.</p>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
						<table className="w-full">
							<thead>
								<tr className="text-xs text-zinc-500 text-left">
									<th className="pb-4 font-medium">Variant</th>
									{sizes.map((s) => (
										<th key={s} className="pb-4 font-medium text-center">
											{s}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{variants.map((v) => (
									<tr key={v} className="border-t border-zinc-800/50">
										<td className="py-4 text-sm text-zinc-400">{v}</td>
										{sizes.map((s) => (
											<td key={s} className="py-4 text-center">
												<Kbd variant={v} size={s}>
													K
												</Kbd>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<CodeBlock title="Kbd.tsx">{`import { Kbd } from 'react-hotkey-display';
import 'react-hotkey-display/styles.css';

<Kbd>K</Kbd>
<Kbd variant="subtle" size="sm">Esc</Kbd>
<Kbd variant="flat" size="lg">⌘</Kbd>`}</CodeBlock>
				</div>
			</div>

			{/* Hotkey */}
			<div className="mb-16">
				<h3 className="text-xl font-semibold text-zinc-200 mb-1">{"<Hotkey>"}</h3>
				<p className="text-sm text-zinc-500 mb-6">
					Keyboard combo with automatic OS detection and symbol mapping.
				</p>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
						<div>
							<p className="text-xs text-zinc-500 mb-3">Standard combos</p>
							<div className="flex flex-wrap gap-4">
								<Hotkey combo="Mod+S" platform={platform} />
								<Hotkey combo="Mod+Shift+P" platform={platform} />
								<Hotkey combo="Mod+Alt+I" platform={platform} />
								<Hotkey combo="Ctrl+Shift+Esc" platform={platform} />
							</div>
						</div>
						<div>
							<p className="text-xs text-zinc-500 mb-3">Sequences</p>
							<div className="flex flex-wrap gap-4">
								<Hotkey combo="G G" platform={platform} />
								<Hotkey combo="Mod+K Mod+S" platform={platform} />
							</div>
						</div>
						<div>
							<p className="text-xs text-zinc-500 mb-3">Variants</p>
							<div className="flex flex-wrap gap-4">
								{variants.map((v) => (
									<Hotkey key={v} combo="Mod+K" platform={platform} variant={v} />
								))}
							</div>
						</div>
					</div>

					<CodeBlock title="Hotkey.tsx">{`import { Hotkey } from 'react-hotkey-display';

// Auto-detects OS, or override:
<Hotkey combo="Mod+S" />
<Hotkey combo="Mod+S" platform="mac" />

// Sequences: "G G" → G → G
<Hotkey combo="G G" />

// Variants + sizes
<Hotkey combo="Mod+K" variant="subtle" />
<Hotkey combo="Mod+K" size="lg" />`}</CodeBlock>
				</div>
			</div>

			{/* ShortcutHint */}
			<div>
				<h3 className="text-xl font-semibold text-zinc-200 mb-1">{"<ShortcutHint>"}</h3>
				<p className="text-sm text-zinc-500 mb-6">
					Action label paired with its keyboard shortcut.
				</p>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
						<ShortcutHint action="Save" combo="Mod+S" platform={platform} />
						<ShortcutHint action="Find" combo="Mod+F" platform={platform} />
						<ShortcutHint action="Command Palette" combo="Mod+Shift+P" platform={platform} />
						<ShortcutHint
							action="Toggle Sidebar"
							combo="Mod+B"
							platform={platform}
							variant="subtle"
						/>
					</div>

					<CodeBlock title="ShortcutHint.tsx">{`import { ShortcutHint } from 'react-hotkey-display';

<ShortcutHint action="Save" combo="Mod+S" />
<ShortcutHint action="Find" combo="Mod+F" />
<ShortcutHint
  action="Toggle Sidebar"
  combo="Mod+B"
  variant="subtle"
/>`}</CodeBlock>
				</div>
			</div>
		</section>
	);
}
