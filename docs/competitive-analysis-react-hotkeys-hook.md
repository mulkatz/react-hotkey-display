# Competitive Analysis: react-hotkeys-hook

**Analysiert:** 2026-03-05
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

## Strategisches Signal: Maintainer Burnout

**Issue #1213 "Looking for people to maintain this package"** (offen seit Sep 2024):
> "With over 700k downloads a week and issues/bug reports coming in on a regular basis, it is way more work to maintain the repo than I ever anticipated."

Das Projekt sucht aktiv Maintainer. Timing für eine Alternative ist ideal.

## Architektur & Code

### Was sie gut machen
- Einfache, intuitive API: `useHotkeys('ctrl+k', callback)`
- Zero dependencies
- Hook-based pattern passt zu modernem React
- Scoping via `HotkeysProvider` mit `enableScope`/`disableScope`
- Focus Trapping via Ref
- Sequence Support (v5): `g>h>i` wie Vim/Gmail
- `useRecordHotkeys` zum Aufnehmen von User-Tastenkombis
- 88+ Test Cases
- Live interactive Docs (Docusaurus)
- ~600-700 Zeilen Kernlogik — sehr lean

### Architektur-Probleme

**1. Per-Hook Event Listener (N×2)**
Jeder `useHotkeys()`-Call hängt eigene `keydown`/`keyup` Listener an. 20 Hotkeys = 40 Listener auf `document`. Keine Event-Delegation.

**2. Globaler Side-Effect via IIFE**
`isHotkeyPressed.ts` enthält eine IIFE die beim Import 4 globale Event-Listener anhängt:
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
- Nicht tree-shakeable
- Läuft bei jedem Import
- Keine Cleanup-Möglichkeit
- `currentlyPressedKeys` ist globaler Module-State

**3. Naive deepEqual Implementierung**
- Kein null-Handling (typeof null === 'object')
- Kein Array vs Object Handling
- Kein short-circuit (reduce statt every)

**4. TypeScript Schwächen**
- 4× `@ts-expect-error` im Core
- Kein JSDoc auf keinem Export — IDE-Hover ist leer
- `OptionsOrDependencyArray = Options | DependencyList` Union ist Code-Smell
- `metadata: Record<string, unknown>` sehr loose
- `Trigger` Type für `enabled` und `preventDefault` wiederverwendet (verschiedene Semantik)

**5. Package.json Lücken**
- Kein `exports` Feld (nutzt legacy `main`/`types`)
- Kein `sideEffects` Feld
- Kein `module` Feld
- ESM-only seit v5 (CJS-User brauchen Bundler)
- Keine Subpath-Imports

### SSR Safety
- `useSafeLayoutEffect` Pattern (useLayoutEffect vs useEffect)
- Checks für `typeof document/window !== 'undefined'`
- ABER: IIFE in `isHotkeyPressed.ts` läuft beim Import (Side-Effect)

## Bekannte Bugs (aus GitHub Issues)

### Kritisch
| Issue | Problem | Kommentare |
|-------|---------|------------|
| #1231 | `enableOnFormTags: true` funktioniert nicht | 11 |
| #1181 | `mod` auf macOS hört auf `ctrl` statt `meta` | 6 |
| #1018 | meta+key keyup feuert nie (macOS Browser-Bug) | 8 |
| #1115 | Modifier-Tasten während andere gehalten → falsche Callbacks | 6 |
| #1058 | Scoped Hotkeys feuern außerhalb des Scope | 5 |
| #1035 | Mehrere Handler für gleiche Taste: disabled einen → disabled alle | 2 |
| #1038 | Provider verursacht komplette Re-Renders | 2 |

### Fehlende Features (aus User-Requests)
- **Key Priority System** (#677) — wer gewinnt bei Überlappung?
- **Conflict Detection** — Warnung bei kollidierenden Hotkeys
- **Ignore Repeat** (#1319) — Key gehalten → nur 1× feuern
- **Modifier Keys in Sequences** (#1261) — `ctrl+a > ctrl+b` nicht supported
- **Key Blacklist for Recording** (#1268)

## `code` vs `key` Problem

Referenz: [Blog "All JavaScript Keyboard Shortcut Libraries Are Broken"](https://blog.duvallj.pw/posts/2025-01-10-all-javascript-keyboard-shortcut-libraries-are-broken.html)

react-hotkeys-hook v5 nutzt `code` by default mit `useKey` als Opt-in. Diese hybride Lösung ist problematisch:
- `code` = physische Taste (Position auf Tastatur)
- `key` = was der User tatsächlich tippt (Layout-abhängig)
- Hybride Nutzung → unvorhersehbares Verhalten bei internationalen Layouts
- Nur `tinykeys` wurde als korrekt implementiert zitiert

**Unsere Lösung:**
- Default: `key` für Character-Shortcuts
- `code` nur für positionelle Tasten (WASD, Arrows)
- Auto-Detection basierend auf Hotkey-Definition
- Klare Dokumentation der Tradeoffs

## Konkurrenz-Landschaft

| Package | Stars | Downloads/Woche | Ansatz |
|---------|-------|-----------------|--------|
| react-hotkeys-hook | 3,418 | 1.74M | Hook-based, populärste |
| react-hotkeys | ~2,100 | ~280K | Component-based, unmaintained |
| tinykeys | ~3,500 | ~300K | Framework-agnostic |
| mousetrap | ~11,600 | ~900K | Vanilla JS, global only |
| @mantine/hooks | N/A | Teil von Mantine | In UI-Framework integriert |

## Unsere Strategie: Shortcut-System mit eingebautem Display

### Core Differentiator
react-hotkeys-hook hat **null UI zum Anzeigen von Shortcuts**. Das `description`-Feld existiert, wird aber nicht gerendert. Unser Killer-Feature ist das Display.

### Ziel-Features

**Display-Komponenten (unique):**
- `<ShortcutHint>` — zeigt Hotkey neben Button/Action
- `<ShortcutPalette>` — Command-Palette (cmd+k Pattern)
- `<ShortcutCheatsheet>` — Vollständige Shortcut-Referenz
- Platform-aware Rendering (⌘ auf Mac, Ctrl auf Windows)
- Automatische OS-Detection

**Architektur-Vorteile:**
- 1 zentraler Event-Listener statt N×2
- Zero side effects beim Import
- `sideEffects: false` + volles Tree-Shaking
- Moderne `exports` mit Subpath-Imports
- ESM + CJS Dual-Format

**Bugs als Features:**
| Ihr Bug | Unsere Lösung |
|---------|---------------|
| `enableOnFormTags` kaputt | Saubere Form-Tag-Detection mit Test-Matrix |
| `mod` macOS kaputt | Korrekte Platform-Abstraction |
| meta+key keyup fehlt | Dokumentiertes Workaround (Timeout-Detection) |
| Handler-Interferenz | Priority-System mit expliziter Ordnung |
| Provider Re-Renders | `useRef` + Subscription statt `useState` |
| Scope-Leak | Strikte Scope-Isolation |

**TypeScript:**
- Strict, zero `@ts-expect-error`
- Volle JSDoc/TSDoc auf jedem Export
- Type-safe Key-Definitionen
- Discriminated Unions statt `Record<string, unknown>`

**Bundle-Ziel:**
- ≤2KB core (gzip)
- Display-Komponenten als separate Entry-Points (code-split)

### Target-Metriken

| Dimension | react-hotkeys-hook | Unser Ziel |
|-----------|-------------------|------------|
| Shortcut Display UI | Non-existent | Killer Feature |
| Event-Architektur | N×2 Listener | 1 zentraler Listener |
| Side Effects | Globale IIFE | Zero |
| TypeScript | @ts-expect-error, kein JSDoc | Strict + JSDoc |
| Form Tags | Buggy | Rock-solid |
| Modifier macOS | Kaputt | Platform-tested |
| Priority System | Keins | Built-in |
| Bundle | 2.7KB gz | ≤2KB core |
| Tree Shaking | Kompromittiert | Voll |
| Package Exports | Legacy main/types | Modern conditional |
