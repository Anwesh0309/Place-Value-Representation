/**
 * Intellia SG — Numbers to 1000
 * Audio cleanup script — removes orphaned .mp3 files
 *
 * Usage: node scripts/clean_audio.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Dynamically import audioMap
async function main() {
  let audioMap = {};
  const mapPath = path.join(ROOT, 'src', 'utils', 'audioMap.js');

  try {
    const { audioMap: m } = await import(mapPath);
    audioMap = m;
  } catch {
    console.log('ℹ️  No audioMap.js found or empty. Treating all files as orphaned.');
  }

  const validFiles = new Set(
    Object.values(audioMap).map((p) => path.basename(p))
  );

  const audioDir = path.join(ROOT, 'public', 'assets', 'audio');
  if (!fs.existsSync(audioDir)) {
    console.log('ℹ️  Audio directory does not exist. Nothing to clean.');
    return;
  }

  const files = fs.readdirSync(audioDir).filter((f) => f.endsWith('.mp3'));
  let removed = 0;

  for (const file of files) {
    if (!validFiles.has(file)) {
      fs.unlinkSync(path.join(audioDir, file));
      console.log(`🗑  Removed orphaned: ${file}`);
      removed++;
    }
  }

  console.log(`\n✅ Clean complete. Removed ${removed} orphaned file(s). ${files.length - removed} active file(s) kept.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
