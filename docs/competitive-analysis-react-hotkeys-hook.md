# Competitive Analysis: react-hotkeys-hook

**Analyzed:** 2026-03-05
**Package:** https://github.com/JohannesKlauss/react-hotkeys-hook
**npm:** https://www.npmjs.com/package/react-hotkeys-hook

## Key Metrics

| Metric | Value |
|--------|-------|
| Stars | 3,418 |
| Weekly Downloads | ~1,741,320 |
| Bundle Size (gzip) | ~2.7 KB |
| Dependencies | 0 |
| Versions | 119 |
| Created | Nov 2018 |
| Latest | v5.2.4 (Feb 2026) |
| Peer Deps | react >=16.8.0, react-dom >=16.8.0 |
| License | MIT |
| Contributors | 56 |
| npm Dependents | 699 |

## Strategic Signal: Maintainer Burnout

**Issue #1213 "Looking for people to maintain this package"** (open since Sep 2024):
> "With over 700k downloads a week and issues/bug reports coming in on a regular basis, it is way more work to maintain the repo than I ever anticipated."

The project is actively looking for maintainers. The timing for an alternative is ideal.

## Architecture & Code

### What they do well
- Simple, intuitive API: `useHotkeys('ctrl+k', callback)`
- Zero dependencies
- Hook-based pattern fits modern React
- Scoping via `HotkeysProvider` with `enableScope`/`disableScope`
- Focus Trapping via Ref
- Sequence Support (v5): `g>h>i` like Vim/Gmail
- `useRecordHotkeys` for recording user key combinations
- 88+ Test Cases
- Live interactive Docs (Docusaurus)
- ~600-700 lines of core logic — very lean

### Architecture Problems

**1. Per-Hook Event Listener (N×2)**
Each `useHotkeys()` call attaches its own `keydown`/`keyup` listeners. 20 hotkeys = 40 listeners on `document`. No event delegation.

**2. Global Side-Effect via IIFE**
`isHotkeyPressed.ts` contains an IIFE that attaches 4 global event listeners on import:
```typescript
;(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', ...)
    document.addEventListener('keyup', ...)
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('blur', ...)
    window.addEventListener('contextmenu', ...)
  }
})()
```
- Not tree-shakeable
- Runs on every import
- No cleanup mechanism
- `currentlyPressedKeys` is global module state

**3. Naive deepEqual Implementation**
- No null handling (typeof null === 'object')
- No Array vs Object handling
- No short-circuit (reduce instead of every)

**4. TypeScript Weaknesses**
- 4× `@ts-expect-error` in core
- No JSDoc on any export — IDE hover is empty
- `OptionsOrDependencyArray = Options | DependencyList` union is a code smell
- `metadata: Record<string, unknown>` very loose
- `Trigger` Type reused for `enabled` and `preventDefault` (different semantics)

**5. Package.json Gaps**
- No `exports` field (uses legacy `main`/`types`)
- No `sideEffects` field
- No `module` field
- ESM-only since v5 (CJS users need a bundler)
- No subpath imports

### SSR Safety
- `useSafeLayoutEffect` pattern (useLayoutEffect vs useEffect)
- Checks for `typeof document/window !== 'undefined'`
- BUT: IIFE in `isHotkeyPressed.ts` runs on import (side effect)

## Known Bugs (from GitHub Issues)

### Critical
| Issue | Problem | Comments |
|-------|---------|----------|
| #1231 | `enableOnFormTags: true` does not work | 11 |
| #1181 | `mod` on macOS listens to `ctrl` instead of `meta` | 6 |
| #1018 | meta+key keyup never fires (macOS browser bug) | 8 |
| #1115 | Modifier keys while others are held → wrong callbacks | 6 |
| #1058 | Scoped hotkeys fire outside of scope | 5 |
| #1035 | Multiple handlers for same key: disabling one → disables all | 2 |
| #1038 | Provider causes full re-renders | 2 |

### Missing Features (from User Requests)
- **Key Priority System** (#677) — who wins on overlap?
- **Conflict Detection** — warning on conflicting hotkeys
- **Ignore Repeat** (#1319) — key held → fire only once
- **Modifier Keys in Sequences** (#1261) — `ctrl+a > ctrl+b` not supported
- **Key Blacklist for Recording** (#1268)

## `code` vs `key` Problem

Reference: [Blog "All JavaScript Keyboard Shortcut Libraries Are Broken"](https://blog.duvallj.pw/posts/2025-01-10-all-javascript-keyboard-shortcut-libraries-are-broken.html)

react-hotkeys-hook v5 uses `code` by default with `useKey` as opt-in. This hybrid approach is problematic:
- `code` = physical key (position on keyboard)
- `key` = what the user actually types (layout-dependent)
- Hybrid usage → unpredictable behavior with international layouts
- Only `tinykeys` was cited as correctly implemented

**Our Solution:**
- Default: `key` for character shortcuts
- `code` only for positional keys (WASD, Arrows)
- Auto-detection based on hotkey definition
- Clear documentation of tradeoffs

## Competitive Landscape

| Package | Stars | Downloads/Week | Approach |
|---------|-------|----------------|----------|
| react-hotkeys-hook | 3,418 | 1.74M | Hook-based, most popular |
| react-hotkeys | ~2,100 | ~280K | Component-based, unmaintained |
| tinykeys | ~3,500 | ~300K | Framework-agnostic |
| mousetrap | ~11,600 | ~900K | Vanilla JS, global only |
| @mantine/hooks | N/A | Part of Mantine | Integrated in UI framework |

## Our Strategy: Shortcut System with Built-in Display

### Core Differentiator
react-hotkeys-hook has **zero UI for displaying shortcuts**. The `description` field exists but is never rendered. Our killer feature is the display.

### Target Features

**Display Components (unique):**
- `<ShortcutHint>` — shows hotkey next to button/action
- `<ShortcutPalette>` — command palette (cmd+k pattern)
- `<ShortcutCheatsheet>` — complete shortcut reference
- Platform-aware rendering (⌘ on Mac, Ctrl on Windows)
- Automatic OS detection

**Architecture Advantages:**
- 1 central event listener instead of N×2
- Zero side effects on import
- `sideEffects: false` + full tree shaking
- Modern `exports` with subpath imports
- ESM + CJS dual format

**Their Bugs as Our Features:**
| Their Bug | Our Solution |
|-----------|-------------|
| `enableOnFormTags` broken | Clean form tag detection with test matrix |
| `mod` macOS broken | Correct platform abstraction |
| meta+key keyup missing | Documented workaround (timeout detection) |
| Handler interference | Priority system with explicit ordering |
| Provider re-renders | `useRef` + subscription instead of `useState` |
| Scope leak | Strict scope isolation |

**TypeScript:**
- Strict, zero `@ts-expect-error`
- Full JSDoc/TSDoc on every export
- Type-safe key definitions
- Discriminated unions instead of `Record<string, unknown>`

**Bundle Target:**
- ≤2KB core (gzip)
- Display components as separate entry points (code-split)

### Target Metrics

| Dimension | react-hotkeys-hook | Our Target |
|-----------|-------------------|------------|
| Shortcut Display UI | Non-existent | Killer Feature |
| Event Architecture | N×2 Listener | 1 central listener |
| Side Effects | Global IIFE | Zero |
| TypeScript | @ts-expect-error, no JSDoc | Strict + JSDoc |
| Form Tags | Buggy | Rock-solid |
| Modifier macOS | Broken | Platform-tested |
| Priority System | None | Built-in |
| Bundle | 2.7KB gz | ≤2KB core |
| Tree Shaking | Compromised | Full |
| Package Exports | Legacy main/types | Modern conditional |
