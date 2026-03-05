# Development Guide

## Demo & GIF Recording

The demo GIF in the README (`assets/demo.gif`) is generated via Playwright video recording and ffmpeg.

### Prerequisites

- **Playwright** — installed as a dev dependency (`npm install`)
- **ffmpeg** — install via Homebrew: `brew install ffmpeg`
- **Playwright browsers** — run `npx playwright install chromium` once

### Recording

```bash
npm run record-demo
```

This single command:

1. Starts the demo dev server (`cd demo && npm run dev`)
2. Launches a headless Chromium browser (800x600 viewport)
3. Playwright records a video of scripted interactions (OS toggle, overlay demos, etc.)
4. Kills the dev server
5. Converts the `.webm` video to an optimized GIF via ffmpeg
6. Outputs `assets/demo.gif` and cleans up the temporary video files

### Modifying Interactions

Edit `scripts/record-demo.ts` to change what gets recorded. The script:

- Uses `page.click()`, `page.fill()`, `page.keyboard.press()` for interactions
- Uses `await wait(ms)` for timing between actions
- Records at 800x600, converted to GIF at 12fps with optimized palette

### Output

- **Video** — saved temporarily to `tmp-video/` (auto-cleaned)
- **GIF** — `assets/demo.gif` (referenced in README.md)

Target: < 2MB, 5-10 seconds duration.

### When to Re-record

Re-record after any visual change to the demo page:

- New/removed sections
- Layout or styling changes
- Component API changes that affect the demo
