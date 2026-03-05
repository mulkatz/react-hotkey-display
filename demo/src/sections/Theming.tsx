import { Hotkey, Kbd } from "react-hotkey-display";
import type { Platform } from "react-hotkey-display";
import { CodeBlock } from "../components/CodeBlock";

interface ThemingProps {
	platform: Platform;
}

const themes = [
	{ name: "GitHub", className: "theme-github" },
	{ name: "Discord", className: "theme-discord" },
	{ name: "Vercel", className: "theme-vercel" },
];

export function Theming({ platform }: ThemingProps) {
	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold text-zinc-50 mb-2">Fully Customizable</h2>
			<p className="text-zinc-400 mb-12">
				Every visual property maps to a CSS custom property. Override them to match your brand.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
				{/* Themed examples */}
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-8">
					{themes.map((theme) => (
						<div key={theme.name}>
							<p className="text-xs text-zinc-500 mb-3">{theme.name}</p>
							<div className={`flex flex-wrap items-center gap-3 ${theme.className}`}>
								<Hotkey combo="Mod+K" platform={platform} />
								<Kbd>{platform === "mac" ? "⌘" : "Ctrl"}</Kbd>
								<Kbd>Shift</Kbd>
								<Kbd>P</Kbd>
							</div>
						</div>
					))}
				</div>

				<CodeBlock title="Custom theme">{`/* Override CSS custom properties */
.my-theme .hkd-kbd {
  --hkd-color: #1f2328;
  --hkd-bg: #f6f8fa;
  --hkd-border: #d1d9e0;
  --hkd-radius: 6px;
  --hkd-font: 'Segoe UI', sans-serif;
}

/* Or apply inline */
<div style={{
  '--hkd-color': '#ededed',
  '--hkd-bg': 'transparent',
  '--hkd-border': '#333',
}}>
  <Hotkey combo="Mod+K" />
</div>`}</CodeBlock>
			</div>

			{/* Unstyled mode */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
					<p className="text-xs text-zinc-500 mb-3">Unstyled mode</p>
					<p className="text-sm text-zinc-400 mb-4">
						Pass{" "}
						<code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded text-xs">unstyled</code>{" "}
						to strip all built-in styles. Bring your own classes.
					</p>
					<div className="flex items-center gap-2">
						<Kbd
							unstyled
							className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm border border-blue-500/30"
						>
							{platform === "mac" ? "⌘" : "Ctrl"}
						</Kbd>
						<span className="text-zinc-600 text-xs">+</span>
						<Kbd
							unstyled
							className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm border border-blue-500/30"
						>
							K
						</Kbd>
					</div>
				</div>

				<CodeBlock title="Unstyled">{`import { Kbd } from 'react-hotkey-display';

/* No styles.css import needed */

<Kbd unstyled className="my-key">
  K
</Kbd>

/* Tailwind example */
<Kbd
  unstyled
  className="px-2 py-1 bg-blue-500/20
    text-blue-400 rounded border
    border-blue-500/30"
>
  ⌘
</Kbd>`}</CodeBlock>
			</div>
		</section>
	);
}
