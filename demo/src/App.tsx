import { useState } from "react";
import { detectPlatform } from "react-hotkey-display";
import type { Platform } from "react-hotkey-display";
import { Cheatsheet } from "./sections/Cheatsheet";
import { Hero } from "./sections/Hero";
import { Integration } from "./sections/Integration";
import { Palette } from "./sections/Palette";
import { Variants } from "./sections/Variants";

export function App() {
	const [platform, setPlatform] = useState<Platform>(detectPlatform);

	return (
		<div className="min-h-screen">
			<div className="max-w-5xl mx-auto px-6">
				<Hero platform={platform} onPlatformChange={setPlatform} />

				<hr className="border-zinc-800" />
				<Variants platform={platform} />

				<hr className="border-zinc-800" />
				<Cheatsheet platform={platform} />

				<hr className="border-zinc-800" />
				<Palette platform={platform} />

				<hr className="border-zinc-800" />
				<Integration />

				<hr className="border-zinc-800" />

				{/* Footer */}
				<footer className="py-16 text-center">
					<p className="text-sm text-zinc-500 mb-4">Install</p>
					<code className="inline-block px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm">
						npm install react-hotkey-display
					</code>
					<div className="mt-8 flex justify-center gap-6 text-sm text-zinc-500">
						<a
							href="https://github.com/mulkatz/react-hotkey-display"
							className="hover:text-zinc-300 transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://npmjs.com/package/react-hotkey-display"
							className="hover:text-zinc-300 transition-colors"
						>
							npm
						</a>
						<span>~3.8KB gzipped</span>
					</div>
					<p className="mt-8 text-xs text-zinc-600">MIT License</p>
				</footer>
			</div>
		</div>
	);
}
