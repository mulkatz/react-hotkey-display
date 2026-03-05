import { type ChildProcess, spawn } from "node:child_process";
import { chromium } from "playwright";

const WIDTH = 800;
const HEIGHT = 600;
const DEV_URL = "http://localhost:5173";

async function waitForServer(url: string, timeout = 15000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not ready yet
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function startDevServer(): Promise<ChildProcess> {
	const proc = spawn("npm", ["run", "dev"], {
		cwd: new URL("../demo", import.meta.url).pathname,
		stdio: "pipe",
	});
	await waitForServer(DEV_URL);
	return proc;
}

async function wait(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function record() {
	console.log("Starting demo dev server...");
	const server = await startDevServer();

	try {
		console.log("Launching browser...");
		const browser = await chromium.launch();
		const context = await browser.newContext({
			viewport: { width: WIDTH, height: HEIGHT },
			recordVideo: {
				dir: "./tmp-video",
				size: { width: WIDTH, height: HEIGHT },
			},
		});

		const page = await context.newPage();
		await page.goto(DEV_URL);

		// Wait for page to fully render
		await wait(1500);

		// Toggle Mac → Windows → Mac to show OS-awareness
		console.log("Switching to Mac...");
		await page.click('button:text("Mac")');
		await wait(1200);

		console.log("Switching to Windows...");
		await page.click('button:text("Windows")');
		await wait(1200);

		console.log("Switching back to Mac...");
		await page.click('button:text("Mac")');
		await wait(800);

		// Open Cheatsheet (now dark-themed)
		console.log("Opening cheatsheet...");
		await page.click('button:text("Open Cheatsheet")');
		await wait(800);

		// Search in cheatsheet
		await page.fill('[placeholder="Search shortcuts..."]', "save");
		await wait(1000);

		// Close cheatsheet
		await page.keyboard.press("Escape");
		await wait(600);

		// Open Command Palette (now dark-themed)
		console.log("Opening command palette...");
		await page.click('button:text("Open Command Palette")');
		await wait(800);

		// Search in palette
		await page.fill('[placeholder="Type a command..."]', "find");
		await wait(600);

		// Navigate and select
		await page.keyboard.press("ArrowDown");
		await wait(400);
		await page.keyboard.press("Enter");
		await wait(1000);

		console.log("Recording complete. Saving video...");
		await context.close();
		await browser.close();

		console.log("Video saved to tmp-video/");
	} finally {
		server.kill();
	}
}

record().catch((err) => {
	console.error("Recording failed:", err);
	process.exit(1);
});
