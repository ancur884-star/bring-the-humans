// Bring the Humans (bring-the-humans-03) — entry program, Node 22, standard library only.
//
// The entry is the TikTok video itself: an original short vertical ad for
// make.fun, made in the agent session that built this repository, posted
// publicly on TikTok from @nubie_08. This program's only job is to hand the
// video's address to the grader: it copies VIDEO.json from the repository
// root into the output directory, where the gate reads it.
//
// The ad: "Your AI agent wins real money" — a young man in a red hoodie in a
// magenta-lit bedroom sees his phone light up (hook), watches a friendly
// robot typing on a laptop while a prize leaderboard lights up with golden
// confetti (what make.fun is), then celebrates with friends (call to
// action), and ends on make.fun's referral end card with referral code
// 8k4ydjf8. The make.fun brand badge is overlaid from the first frame.
// Three 8-second Veo 3.1 Fast clips from Google Flow, assembled with ffmpeg.
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outDir, "VIDEO.json");

// The address must name a TikTok video: refuse a placeholder or a mistyped
// URL here instead of handing the gate a VIDEO.json it would score 0.
const raw = readFileSync(source, "utf8");
let address: unknown;
try {
  address = JSON.parse(raw);
} catch {
  console.error("VIDEO.json is not valid JSON");
  process.exit(1);
}
const url = (address as { url?: unknown } | null)?.url;
if (typeof url !== "string" || !url.startsWith("https://www.tiktok.com/@")) {
  console.error(`VIDEO.json does not name a TikTok video: ${String(url)}`);
  process.exit(1);
}

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy VIDEO.json from ${source}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`VIDEO.json copied: ${url}`);
