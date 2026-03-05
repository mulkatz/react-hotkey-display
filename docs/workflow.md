# Project Workflow

End-to-end guide for the react-hotkey-display project lifecycle. Reusable pattern for all github-star-projects.

## Project Structure

```
├── src/                    # Library source (TypeScript + CSS)
│   ├── __tests__/          # Vitest unit tests (jsdom environment)
│   ├── styles.css          # Base component styles
│   ├── cheatsheet.css      # Cheatsheet overlay styles
│   ├── palette.css         # Command palette styles
│   ├── index.ts            # Public API exports
│   └── *.tsx               # Component source files
├── dist/                   # Build output (gitignored)
├── demo/                   # Interactive demo page (own package.json)
│   ├── src/
│   │   ├── sections/       # Demo sections (Hero, Variants, Overlays, Theming, Integration)
│   │   └── app.css         # Demo-specific dark theme overrides
│   └── dist/               # Built demo (deployed to Cloudflare, gitignored)
├── scripts/
│   └── record-demo.ts      # Playwright video recording script
├── assets/
│   └── demo.gif            # Generated GIF for README (tracked in git)
├── docs/
│   ├── adr/                # Architecture Decision Records (gitignored)
│   ├── deployment.md       # Cloudflare Pages setup details
│   ├── development.md      # GIF recording details
│   └── workflow.md         # This file
├── .github/workflows/
│   ├── ci.yml              # Lint + test + build on push/PR
│   └── publish.yml         # npm publish on GitHub release
├── biome.json              # Linter/formatter config (tabs, double quotes, 100 line width)
├── tsup.config.ts          # Build config (ESM + CJS, DTS, minify, treeshake)
├── tsconfig.json           # TypeScript config (strict, ES2022, react-jsx)
├── vitest.config.ts        # Test config (jsdom environment)
├── wrangler.json           # Cloudflare Workers static asset config
├── icon.png                # Project icon (generated via snapai)
├── LICENSE                 # MIT
├── README.md               # Project README with GIF, install, API docs
└── package.json            # Library package
```

## Configuration

### Build (`tsup.config.ts`)

tsup bundles the library into ESM + CJS with TypeScript declarations:

```ts
{
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true, sourcemap: true, clean: true,
  minify: true, treeshake: true,
  external: ["react", "react/jsx-runtime"]
}
```

**Important**: CSS files are not bundled by tsup. The build script copies them manually:

```bash
tsup && cp src/styles.css src/cheatsheet.css src/palette.css dist/
```

### Package Exports (`package.json`)

The library uses conditional exports for ESM/CJS consumers and separate CSS entry points:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./styles.css": "./dist/styles.css",
    "./cheatsheet.css": "./dist/cheatsheet.css",
    "./palette.css": "./dist/palette.css"
  },
  "sideEffects": ["./dist/*.css"]
}
```

Consumers import CSS as: `import "react-hotkey-display/styles.css"`.

### Linter/Formatter (`biome.json`)

- Indent: tabs
- Line width: 100
- Quotes: double
- Semicolons: always
- Rules: recommended + `noUnusedImports`, `noUnusedVariables` as errors

### Tests (`vitest.config.ts`)

- Environment: jsdom (DOM simulation for React component tests)
- Run: `npm test` (single run) or `npm run test:watch`

## Local Development

### Library

```bash
npm install                 # Install dependencies
npm run dev                 # Watch mode (tsup rebuilds on change)
npm run check               # Biome lint + format check
npm run check:fix           # Auto-fix lint/format issues
npm test                    # Run all tests (vitest)
npm run test:watch          # Watch mode tests
npm run build               # Production build (tsup + copy CSS to dist/)
```

### Demo Page

```bash
cd demo
npm install                 # Separate dependencies (links library via file:..)
npm run dev                 # Vite dev server (localhost:5173)
npm run build               # Production build (tsc + vite → demo/dist/)
npm run preview             # Preview production build locally
```

The demo imports the library via `"react-hotkey-display": "file:.."` in its `package.json`. For local development, run both dev servers simultaneously:

```bash
# Terminal 1: Library watch mode
npm run dev

# Terminal 2: Demo dev server
cd demo && npm run dev
```

Changes to library source are picked up automatically by the demo's Vite dev server.

## App Icon

Generate a project icon using snapai:

```bash
npx snapai icon --prompt "minimal keyboard key icon, monochrome, developer tool" \
  --background transparent --output-format png
```

Output: `icon.png` in project root. Referenced in README with:

```html
<p align="center"><img src="./icon.png" width="120" /></p>
```

## Demo Page

### Stack
- **Vite** + TypeScript + React + Tailwind CSS v4
- Own `package.json` with own `node_modules`
- Library linked as relative dependency: `"file:.."`
- Build: `tsc -b && vite build` → `demo/dist/`

### Design Rules
- No AI-look (no gradients, no glow effects)
- Monochrome or max 2 colors
- Whitespace-heavy, intentional typography
- Interactive examples with real use-cases
- Mobile-responsive

### Hosting
- **Cloudflare Pages** connected to GitHub repo
- Custom domain: `react-hotkey-display.mulkatz.dev`
- See [deployment.md](./deployment.md) for full setup details

## GIF Recording

### Prerequisites
- Playwright: `npm install` (dev dependency)
- Playwright browsers: `npx playwright install chromium` (one-time setup)
- ffmpeg: `brew install ffmpeg`

### Record

```bash
npm run record-demo
```

This command (defined in root `package.json`):
1. Starts the demo dev server (`cd demo && npm run dev`)
2. Launches headless Chromium (800x600 viewport)
3. Runs scripted interactions from `scripts/record-demo.ts`
4. Kills the dev server
5. Converts `.webm` video to optimized GIF via ffmpeg (12fps, 128 colors, bayer dithering)
6. Outputs `assets/demo.gif` and cleans up `tmp-video/`

Target: < 2MB, 5-10 seconds duration. The GIF is tracked in git and must be committed before pushing.

See [development.md](./development.md) for details on modifying interactions.

## CI/CD Pipeline

### CI (`ci.yml`)

Triggers on: push to `main`, pull requests to `main`, manual dispatch.

```
checkout → setup Node (matrix: 20, 22) → npm ci → lint → test → build
```

Runs against two Node versions to ensure compatibility.

### Publish (`publish.yml`)

Triggers on: GitHub release published, manual dispatch.

```
checkout → setup Node 22 (registry: npmjs.org) → npm ci → lint → test → build → npm publish
```

Key details:
- **`--provenance`**: Generates npm provenance attestation (proves the package was built from this repo). Requires `id-token: write` permission in the workflow.
- **`--access public`**: Required for scoped or first-time packages.
- **`NPM_TOKEN`**: Repository secret. Configure in GitHub → Settings → Secrets → Actions.
- **`prepublishOnly: "npm run build"`**: Defined in `package.json`, ensures the library is always built before publishing. This runs automatically during `npm publish`.

### Cloudflare Pages Deployment

Auto-deploys on every push to `main` via GitHub integration (not via wrangler).

| Setting | Value |
|---------|-------|
| Build command | `npm install && npm run build && cd demo && npm install && npm run build` |
| Output directory | `demo/dist` |
| Custom domain | `react-hotkey-display.mulkatz.dev` |

**Important**: The build command must build the library first (`npm run build`), then the demo. The `dist/` directory is gitignored, so Cloudflare's build environment starts without it. The demo's `file:..` dependency creates a symlink to the parent — the library's `dist/` must exist before the demo can build.

### Wrangler (`wrangler.json`)

An alternative manual deployment path exists via Cloudflare Workers:

```json
{
  "name": "react-hotkey-display",
  "assets": { "directory": "demo/dist" }
}
```

Deploy manually with: `npx wrangler deploy` (requires Cloudflare auth via `wrangler login`).

The primary deployment method is Cloudflare Pages auto-deploy (see above). Wrangler is useful for testing deployments without pushing to main.

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature or component |
| `fix:` | Bug fix |
| `docs:` | Documentation, README, GIF updates |
| `chore:` | Version bumps, dependency updates, config changes |
| `refactor:` | Code restructuring without behavior change |
| `test:` | Adding or updating tests |
| `style:` | Formatting, whitespace (no code change) |

Use scopes for specificity: `feat(demo):`, `fix(kbd):`, `refactor(palette):`.

Keep commits atomic — each commit is a single, self-contained change.

## Release Process

Step-by-step checklist from code change to live:

### 1. Verify

```bash
npm run check               # Lint clean
npm test                    # All tests pass
npm run build               # Library builds
cd demo && npm run build    # Demo builds
```

### 2. Record GIF (if visual changes)

```bash
npm run record-demo         # Re-record assets/demo.gif
```

The GIF must be committed before pushing — it's tracked in git.

### 3. Version Bump

Update `version` in `package.json` only (no other files reference the version). Follow semver:
- **patch** (1.1.x): bug fixes, minor improvements
- **minor** (1.x.0): new features, backward-compatible
- **major** (x.0.0): breaking changes

### 4. Commit

Use atomic, conventional commits. Example:

```bash
git add demo/src/app.css demo/src/sections/Theming.tsx
git commit -m "fix(demo): apply theme overrides via CSS classes"

git add assets/demo.gif
git commit -m "docs: re-record demo GIF"

git add package.json
git commit -m "chore: bump version to 1.1.1"
```

### 5. Tag and Push

```bash
git tag v1.1.1
git push && git push --tags
```

### 6. Create GitHub Release

```bash
gh release create v1.1.1 --title "v1.1.1" --notes "Bug fixes and improvements"
```

### 7. Verify Deployment

After push and release, three things trigger automatically:

| What | Trigger | Result |
|------|---------|--------|
| GitHub Actions CI | push to main | lint + test + build (Node 20, 22) |
| npm Publish | release published | `npm publish --provenance --access public` |
| Cloudflare Pages | push to main | Demo deployed to `react-hotkey-display.mulkatz.dev` |

Verification checklist:

```bash
gh run list                                      # CI + publish workflows green
npm view react-hotkey-display version             # npm version updated
curl -sI https://react-hotkey-display.mulkatz.dev # Demo reachable
```

## .gitignore

Key rules — these files are NOT committed:

| Pattern | Reason |
|---------|--------|
| `dist/` | Build output, regenerated |
| `demo/dist/` | Demo build output |
| `demo/node_modules/` | Demo dependencies |
| `node_modules/` | Dependencies |
| `CLAUDE.md` | Local-only AI instructions |
| `docs/adr/` | Local-only architecture decisions |
| `.claude/` | Local-only AI config |
| `tmp-video/` | Temporary recording files |
| `*.tsbuildinfo` | TypeScript incremental build cache |

`assets/demo.gif` IS tracked (needed in README on GitHub).

## Applying to New Projects

This workflow is reusable across all github-star-projects:

### Files to copy and adapt

| File | Adapt |
|------|-------|
| `.github/workflows/ci.yml` | Usually no changes needed |
| `.github/workflows/publish.yml` | Usually no changes needed |
| `biome.json` | Usually no changes needed |
| `tsup.config.ts` | Update `entry` if different |
| `tsconfig.json` | Usually no changes needed |
| `vitest.config.ts` | Usually no changes needed |
| `wrangler.json` | Update `name` |
| `.gitignore` | Usually no changes needed |
| `LICENSE` | Update copyright year/name |

### Steps for a new project

1. **Init**: `npm init`, copy config files above
2. **Library**: Write source in `src/`, export from `src/index.ts`
3. **Tests**: Write tests in `src/__tests__/`, run with `npm test`
4. **Demo**: Create `demo/` with Vite + React + Tailwind, link library via `"file:.."`
5. **Icon**: `npx snapai icon --prompt "..." --background transparent --output-format png`
6. **GIF**: Create `scripts/record-demo.ts`, run `npm run record-demo`
7. **CI/CD**: Push `.github/workflows/`, configure `NPM_TOKEN` secret
8. **Cloudflare**: Create Pages project, connect GitHub, set build command, add custom domain `[tool].mulkatz.dev`
9. **Release**: Follow the release process above

Key principle: every project ships with library + demo + GIF + CI/CD + auto-deploy from day one.
