import { Hotkey } from "react-hotkey-display";
import type { Platform } from "react-hotkey-display";

const platforms: { value: Platform; label: string }[] = [
	{ value: "mac", label: "Mac" },
	{ value: "windows", label: "Windows" },
	{ value: "linux", label: "Linux" },
];

interface HeroProps {
	platform: Platform;
	onPlatformChange: (p: Platform) => void;
}

export function Hero({ platform, onPlatformChange }: HeroProps) {
	return (
		<section className="py-24 text-center">
			<p className="mb-6 text-sm font-medium tracking-widest text-zinc-500 uppercase">
				React Component Library
			</p>

			<h1 className="text-5xl font-bold tracking-tight text-zinc-50 mb-4">react-hotkey-display</h1>

			<p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
				The visual display layer for the React hotkey ecosystem. OS-aware keyboard shortcuts,
				cheatsheet overlay, and command palette.
			</p>

			{/* OS Switcher */}
			<div className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 mb-12">
				{platforms.map((p) => (
					<button
						key={p.value}
						type="button"
						onClick={() => onPlatformChange(p.value)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							platform === p.value
								? "bg-zinc-700 text-zinc-100"
								: "text-zinc-400 hover:text-zinc-200"
						}`}
					>
						{p.label}
					</button>
				))}
			</div>

			{/* Interactive demo */}
			<div className="flex flex-wrap justify-center items-center gap-8">
				{["elevated", "subtle", "flat", "outlined"].map((variant) => (
					<div key={variant} className="text-center">
						<Hotkey
							combo="Mod+Shift+K"
							platform={platform}
							variant={variant as "elevated" | "subtle" | "flat" | "outlined"}
							size="lg"
						/>
						<p className="mt-2 text-xs text-zinc-500">{variant}</p>
					</div>
				))}
			</div>
		</section>
	);
}
