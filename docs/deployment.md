# Cloudflare Pages Deployment

## Domain

- **Registrar**: Cloudflare Registrar
- **Domain**: `mulkatz.dev`
- **DNS**: Wildcard `*.mulkatz.dev` → Cloudflare Pages

## Pages Project

| Setting | Value |
|---------|-------|
| Repository | `mulkatz/react-hotkey-display` |
| Production branch | `main` |
| Build command | `npm install && npm run build && cd demo && npm install && npm run build` |
| Output directory | `demo/dist` |
| Custom domain | `react-hotkey-display.mulkatz.dev` |

## Setup Steps

1. Complete domain purchase at Cloudflare Registrar
2. Create new Cloudflare Pages project → connect GitHub repo
3. Configure build settings (see table above)
4. Add custom domain: `react-hotkey-display.mulkatz.dev`
5. Set up wildcard DNS record for `*.mulkatz.dev`

## Alternative (Immediate)

Cloudflare Pages provides a default URL (`react-hotkey-display.pages.dev`) that works without a custom domain. Use this for testing before the domain is ready.

## Pattern for Future Tools

Each tool follows the same pattern:

- Repository: `mulkatz/[tool-name]`
- Build command: `npm install && npm run build && cd demo && npm install && npm run build`
- Output directory: `demo/dist`
- Custom domain: `[tool-name].mulkatz.dev`
