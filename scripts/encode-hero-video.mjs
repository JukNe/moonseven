#!/usr/bin/env node
/**
 * Re-encodes public/background-video.mp4 to H.264 + yuv420p + faststart so
 * browsers can decode it (fixes HEVC/ProRes/etc. “format not supported”).
 *
 * Requires ffmpeg on PATH: https://ffmpeg.org/download.html
 *
 * Usage: npm run encode:hero-video
 */
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "public", "background-video.mp4");
const outMp4 = join(root, "public", "background-video.mp4");
const tmpMp4 = join(root, "public", "background-video.h264.tmp.mp4");

function run(bin, args) {
  const r = spawnSync(bin, args, { stdio: "inherit", shell: false });
  if (r.error) {
    console.error(r.error.message);
    process.exit(1);
  }
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

if (!existsSync(input)) {
  console.error("Missing", input);
  process.exit(1);
}

console.log("Encoding H.264 MP4 (browser-safe)…");
run("ffmpeg", [
  "-y",
  "-i",
  input,
  "-c:v",
  "libx264",
  "-profile:v",
  "main",
  "-pix_fmt",
  "yuv420p",
  "-preset",
  "medium",
  "-crf",
  "23",
  "-movflags",
  "+faststart",
  "-an",
  tmpMp4,
]);

copyFileSync(tmpMp4, outMp4);
unlinkSync(tmpMp4);
console.log("Wrote", outMp4);
console.log("Commit public/background-video.mp4 and redeploy.");
