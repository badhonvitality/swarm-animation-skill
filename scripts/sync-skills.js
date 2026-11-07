#!/usr/bin/env node

/**
 * Cross-platform synchronization script for Swarm Animation Skill.
 * Synchronizes canonical skill files from skills/swarm-animation to .agents/skills/swarm-animation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDir = path.join(projectRoot, 'skills', 'swarm-animation');
const targetDir = path.join(projectRoot, '.agents', 'skills', 'swarm-animation');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Error: Source directory ${src} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🔄 Synchronizing Swarm Animation Skill...');
console.log(`  Source: ${path.relative(projectRoot, sourceDir)}`);
console.log(`  Target: ${path.relative(projectRoot, targetDir)}`);

try {
  copyRecursive(sourceDir, targetDir);
  console.log('✅ Skill synchronization completed successfully.');
} catch (err) {
  console.error('❌ Skill synchronization failed:', err);
  process.exit(1);
}
