# react-hotkey-display

Beautiful keyboard shortcut display with automatic OS detection. Shows `⌘` on Mac, `Ctrl` on Windows/Linux.

## Features

- **Automatic OS detection** — `Mod+S` renders as `⌘S` on Mac, `Ctrl + S` on Windows
- **Mac symbols** — `⌘` `⇧` `⌥` `⌃` `⏎` `⌫` `⇥` `⎋` and more
- **4 visual themes** — elevated (macOS-style), subtle (GitHub-style), flat, outlined
- **Accessible** — semantic `<kbd>` elements, ARIA labels, screen reader friendly
- **SSR-safe** — works with Next.js via `useSyncExternalStore`, accepts `platform` prop override
- **Tiny** — ~1.5KB JS + ~0.8KB CSS gzipped
- **CSS Custom Properties** — full theming control

## Install

```bash
npm install react-hotkey-display
```

## Quick Start

```tsx
import { Hotkey } from 'react-hotkey-display';
import 'react-hotkey-display/styles.css';

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
| `PageUp` | Page Up | Page Up |
| `PageDown` | Page Down | Page Down |
| `Home` | Home | Home |
| `End` | End | End |
| `F1`–`F12` | F1–F12 | F1–F12 |
| `Plus` | + | + |
| `CapsLock` | ⇪ | Caps Lock |

## Theming

Customize via CSS Custom Properties:

```css
:root {
  --hkd-font: 'Inter', sans-serif;
  --hkd-font-size: 0.75rem;
  --hkd-radius: 6px;
  --hkd-color: #1a1a1a;
  --hkd-bg: #f5f5f5;
  --hkd-border: #e5e5e5;
}
```

All CSS classes use the `hkd-` prefix (e.g. `hkd-kbd`, `hkd-hotkey`, `hkd-elevated`).

Dark mode is supported automatically via `prefers-color-scheme` for all four variants.

## Utility Functions

For headless usage without React components:

```ts
import { formatCombo, formatKey, parseCombo, detectPlatform } from 'react-hotkey-display';

const platform = detectPlatform(); // 'mac' | 'windows' | 'linux'
const keys = formatCombo('Mod+Shift+K', platform); // ['⇧', '⌘', 'K'] on Mac
```

### Formatting

| Function | Description |
|----------|-------------|
| `formatCombo(combo, platform)` | Format a full combo string into display keys |
| `formatKey(key, platform)` | Format a single key for a given platform |
| `parseCombo(combo)` | Parse a combo string like `"Mod+Shift+K"` into `["Mod", "Shift", "K"]` |

### Accessibility

| Function | Description |
|----------|-------------|
| `getAriaLabel(key)` | Get screen reader label for a formatted key symbol (e.g. `"⌘"` -> `"Command"`) |
| `getComboAriaLabel(keys)` | Get full screen reader label for formatted keys (e.g. `["⇧", "⌘", "K"]` -> `"Shift plus Command plus K"`) |

### Platform Detection

| Function | Description |
|----------|-------------|
| `detectPlatform()` | Detect the user's OS. Returns `'mac'`, `'windows'`, or `'linux'` |
| `usePlatform(override?)` | React hook for SSR-safe platform detection via `useSyncExternalStore` |
| `resetPlatformCache()` | Reset the cached platform detection result (useful for testing) |

## SSR / Next.js

The `usePlatform` hook uses `useSyncExternalStore` for hydration-safe platform detection. On the server, it always renders as `"windows"` (the most common platform). After hydration on the client, it updates to the detected platform. This means Mac users may see a brief flash from `Ctrl` to `⌘` on first load.

```tsx
import { usePlatform } from 'react-hotkey-display';

function MyComponent() {
  const platform = usePlatform(); // SSR-safe, no hydration mismatch
  return <p>You're on {platform}</p>;
}
```

Or pass `platform` directly to skip detection entirely (useful when you know the platform server-side):

```tsx
<Hotkey combo="Mod+S" platform="mac" />
```

## Browser Support

Works in all modern browsers (Chrome 77+, Firefox 63+, Safari 13.1+, Edge 79+).

## License

MIT
