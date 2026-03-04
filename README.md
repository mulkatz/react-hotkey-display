# hotkey-display

Beautiful keyboard shortcut display with automatic OS detection. Shows `⌘` on Mac, `Ctrl` on Windows/Linux.

<!-- TODO: Add screenshot/GIF here -->

## Features

- **Automatic OS detection** — `Mod+S` renders as `⌘S` on Mac, `Ctrl + S` on Windows
- **Mac symbols** — `⌘` `⇧` `⌥` `⌃` `⏎` `⌫` `⇥` `⎋` and more
- **4 visual themes** — elevated (macOS-style), subtle (GitHub-style), flat, outlined
- **Accessible** — semantic `<kbd>` elements, ARIA labels, screen reader friendly
- **SSR-safe** — works with Next.js, accepts `platform` prop for server rendering
- **Tiny** — ~1KB JS + ~0.8KB CSS gzipped
- **CSS Custom Properties** — full theming control

## Install

```bash
npm install hotkey-display
```

## Quick Start

```tsx
import { Hotkey } from 'hotkey-display';
import 'hotkey-display/styles.css';

function App() {
  return (
    <div>
      <p>Save: <Hotkey combo="Mod+S" /></p>
      <p>Search: <Hotkey combo="Mod+K" /></p>
      <p>Undo: <Hotkey combo="Mod+Z" /></p>
    </div>
  );
}
```

On Mac, this renders: `⌘S`, `⌘K`, `⌘Z`
On Windows: `Ctrl + S`, `Ctrl + K`, `Ctrl + Z`

## Components

### `<Hotkey>`

Displays a keyboard shortcut with OS-aware formatting.

```tsx
<Hotkey combo="Mod+Shift+P" />           // ⇧⌘P (Mac) or Ctrl + Shift + P (Windows)
<Hotkey combo="Mod+K" variant="subtle" /> // GitHub-style
<Hotkey combo="Alt+Enter" />              // ⌥⏎ (Mac) or Alt + Enter (Windows)
<Hotkey combo="Escape" />                 // ⎋ (Mac) or Esc (Windows)
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `combo` | `string` | required | Key combo, e.g. `"Mod+Shift+K"` |
| `platform` | `'mac' \| 'windows' \| 'linux'` | auto-detect | Override OS detection |
| `variant` | `'elevated' \| 'subtle' \| 'flat' \| 'outlined'` | `'elevated'` | Visual style |
| `separator` | `string` | `""` (Mac) / `" + "` (Win) | Key separator |
| `className` | `string` | — | Additional CSS class |

### `<Kbd>`

Single key display.

```tsx
<Kbd>⌘</Kbd>
<Kbd variant="subtle">Ctrl</Kbd>
```

## The `Mod` Key

Use `Mod` as a platform-agnostic modifier:
- **Mac**: renders as `⌘` (Command)
- **Windows/Linux**: renders as `Ctrl`

## Supported Keys

| Input | Mac | Windows |
|-------|-----|---------|
| `Mod` | ⌘ | Ctrl |
| `Ctrl` | ⌃ | Ctrl |
| `Shift` | ⇧ | Shift |
| `Alt` / `Option` | ⌥ | Alt |
| `Enter` | ⏎ | Enter |
| `Backspace` | ⌫ | Backspace |
| `Delete` | ⌦ | Delete |
| `Tab` | ⇥ | Tab |
| `Escape` | ⎋ | Esc |
| `Space` | ␣ | Space |
| `Up/Down/Left/Right` | ↑↓←→ | ↑↓←→ |

## Theming

Customize via CSS Custom Properties:

```css
.hkd-kbd {
  --hkd-font: 'Inter', sans-serif;
  --hkd-font-size: 0.75rem;
  --hkd-radius: 6px;
  --hkd-color: #1a1a1a;
  --hkd-bg: #f5f5f5;
  --hkd-border: #e5e5e5;
}
```

Dark mode is supported automatically via `prefers-color-scheme`.

## Utility Functions

For headless usage without React components:

```ts
import { formatCombo, detectPlatform } from 'hotkey-display';

const platform = detectPlatform(); // 'mac' | 'windows' | 'linux'
const keys = formatCombo('Mod+Shift+K', platform); // ['⇧', '⌘', 'K'] on Mac
```

## Browser Support

Works in all modern browsers (Chrome 77+, Firefox 63+, Safari 13.1+, Edge 79+).

## License

MIT
