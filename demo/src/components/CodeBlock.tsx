interface CodeBlockProps {
	children: string;
	title?: string;
}

export function CodeBlock({ children, title }: CodeBlockProps) {
	return (
		<div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
			{title && (
				<div className="border-b border-zinc-800 px-4 py-2 text-xs text-zinc-500">{title}</div>
			)}
			<pre className="p-4 text-sm text-zinc-300 overflow-x-auto">
				<code>{children}</code>
			</pre>
		</div>
	);
}
