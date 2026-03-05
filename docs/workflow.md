# Project Workflow

End-to-end guide for the react-hotkey-display project lifecycle. Reusable pattern for all github-star-projects.

## Project Structure

```
├── src/                    # Library source (TypeScript + CSS)
│   ├── __tests__/          # Vitest unit tests
│   ├── styles.css          # Base component styles
│   ├── cheatsheet.css      # Cheatsheet overlay styles
│   ├── palette.css         # Command palette styles
│   └── index.ts            # Public API exports
├── demo/                   # Interactive demo page (own package.json)
│   ├── src/
│   │   ├── sections/       # Demo sections (Hero, Theming, etc.)
│   │   └── app.css         # Demo-specific dark theme overrides
│   └── dist/               # Built demo (deployed to Cloudflare)
├── scripts/
│   └── record-demo.ts      # Playwright video recording script
├── assets/
│   └── demo.gif            # Generated GIF for README
├── docs/
│   ├── adr/                # Architecture Decision Records
│   ├── deployment.md       # Cloudflare Pages setup
│   ├── development.md      # GIF recording details
│   └── workflow.md         # This file
├── .github/workflows/
│   ├── ci.yml              # Lint + test + build on push/PR
│   └── publish.yml         # npm publish on GitHub release
├── wrangler.json           # Cloudflare Workers config (static assets)
├── icon.png                # Project icon (generated via snapai)
└── package.json            # Library package
```

## Local Development

### Library

```bash
npm install                 # Install dependencies
npm run dev                 # Watch mode (tsup)
npm run check               # Biome lint + format check
npm run check:fix           # Auto-fix lint/format issues
npm test                    # Run all tests (vitest)
npm run test:watch          # Watch mode tests
npm run build               # Production build (tsup + copy CSS)
```

### Demo Page

```bash
cd demo
npm install                 # Separate dependencies
npm run dev                 # Vite dev server (localhost:5173)
npm run build               # Production build → demo/dist/
```

The demo imports the library via `"react-hotkey-display": "file:.."` in its `package.json`. Changes to the library source are picked up automatically during `npm run dev` (both library and demo dev servers should run simultaneously).

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
- **Vite** + TypeScript + React + Tailwind CSS
- Own `package.json` with own `node_modules`
- Library linked as relative dependency: `"file:.."`

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
- Playwright browsers: `npx playwright install chromium`
- ffmpeg: `brew install ffmpeg`

### Record

```bash
npm run record-demo
```

This command:
1. Starts the demo dev server
2. Launches headless Chromium (800x600)
3. Runs scripted interactions from `scripts/record-demo.ts`
4. Converts `.webm` video to optimized GIF via ffmpeg
5. Outputs `assets/demo.gif` (< 2MB target)

See [development.md](./development.md) for details on modifying interactions.

## CI/CD Pipeline

### CI (`ci.yml`)

Triggers on: push to `main`, pull requests to `main`, manual dispatch.

Steps: checkout → setup Node (20, 22) → `npm ci` → lint → test → build.

### Publish (`publish.yml`)

Triggers on: GitHub release published, manual dispatch.

Steps: checkout → setup Node 22 → `npm ci` → lint → test → build → `npm publish --provenance --access public`.

Requires `NPM_TOKEN` secret configured in GitHub repo settings.

### Cloudflare Deployment

Auto-deploys on every push to `main` via GitHub integration.

| Setting | Value |
|---------|-------|
| Build command | `cd demo && npm install && npm run build` |
| Output directory | `demo/dist` |
| Custom domain | `react-hotkey-display.mulkatz.dev` |

Note: The library must be built before the demo can import it. Cloudflare's build command handles this because the demo's `npm install` triggers the library build via the `file:..` dependency.

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

### 3. Version Bump

Update `version` in `package.json`. Follow semver:
- **patch** (1.1.x): bug fixes, minor improvements
- **minor** (1.x.0): new features, backward-compatible
- **major** (x.0.0): breaking changes

### 4. Commit

Use atomic, conventional commits:

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

After push and release:
- **GitHub Actions CI** runs automatically (lint, test, build)
- **publish.yml** triggers on release → publishes to npm with provenance
- **Cloudflare Pages** auto-deploys demo from main

Check:
- [ ] CI workflow green: `gh run list`
- [ ] npm package updated: `npm view react-hotkey-display version`
- [ ] Demo live: `https://react-hotkey-display.mulkatz.dev`

## Applying to New Projects

This workflow is reusable across all github-star-projects:

1. **Copy CI/CD**: `.github/workflows/ci.yml` and `publish.yml`
2. **Copy wrangler.json**: Update project name
3. **Demo setup**: `demo/` directory with Vite + React + Tailwind, `"file:.."` dependency
4. **Recording**: Copy `scripts/record-demo.ts`, adapt interactions
5. **Cloudflare**: Create new Pages project, connect GitHub, add custom domain `[tool].mulkatz.dev`
6. **npm**: Configure `NPM_TOKEN` secret, update `package.json` metadata
7. **Icon**: Generate with `npx snapai icon --prompt "..." --background transparent --output-format png`

Key principle: every project ships with library + demo + GIF + CI/CD + auto-deploy from day one.
