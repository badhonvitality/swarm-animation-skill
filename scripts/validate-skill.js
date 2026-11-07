#!/usr/bin/env node

/**
 * Validation script for Swarm Animation Skill.
 * Validates YAML frontmatter, directory structure, references, and examples.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const canonicalSkillDir = path.join(projectRoot, 'skills', 'swarm-animation');
const canonicalSkillMd = path.join(canonicalSkillDir, 'SKILL.md');
const agentSkillMd = path.join(projectRoot, '.agents', 'skills', 'swarm-animation', 'SKILL.md');

let hasErrors = false;

function error(msg) {
  console.error(`❌ [Validation Error] ${msg}`);
  hasErrors = true;
}

function success(msg) {
  console.log(`✅ ${msg}`);
}

console.log('🔍 Validating Swarm Animation Skill structure and integrity...\n');

// 1. Verify SKILL.md existence
if (!fs.existsSync(canonicalSkillMd)) {
  error(`Canonical SKILL.md not found at ${canonicalSkillMd}`);
} else {
  success('Found canonical SKILL.md');
  const content = fs.readFileSync(canonicalSkillMd, 'utf8');

  // Verify YAML frontmatter
  if (!content.startsWith('---')) {
    error('SKILL.md missing opening YAML frontmatter delimiter (---)');
  }
  if (!content.includes('name: swarm-animation')) {
    error('SKILL.md missing "name: swarm-animation" in frontmatter');
  }
  if (!content.includes('description:')) {
    error('SKILL.md missing "description:" in frontmatter');
  }
  success('Valid YAML frontmatter in SKILL.md');
}

// 2. Verify agent discovery SKILL.md
if (!fs.existsSync(agentSkillMd)) {
  error(`Agent discovery SKILL.md not found at ${agentSkillMd}`);
} else {
  success('Found agent discovery copy at .agents/skills/swarm-animation/SKILL.md');
}

// 3. Verify reference files
const requiredReferences = [
  'animation-system.md',
  'mouse-control.md',
  'physics-engine.md',
  'react-architecture.md',
  'design-system.md',
  'implementation-guide.md',
];

for (const ref of requiredReferences) {
  const refPath = path.join(canonicalSkillDir, 'references', ref);
  if (!fs.existsSync(refPath)) {
    error(`Missing reference document: references/${ref}`);
  } else {
    success(`Verified reference: references/${ref}`);
  }
}

// 4. Verify examples
const requiredExamples = [
  'swarm-canvas.example.jsx',
  'agent-cursor.example.jsx',
  'mouse-tracking.example.js',
  'physics-engine.example.js',
];

for (const ex of requiredExamples) {
  const exPath = path.join(canonicalSkillDir, 'examples', ex);
  if (!fs.existsSync(exPath)) {
    error(`Missing example file: examples/${ex}`);
  } else {
    success(`Verified example: examples/${ex}`);
  }
}

// 5. Verify assets
const requiredAssets = [
  'design-reference.png',
  'architecture.svg',
];

for (const asset of requiredAssets) {
  const assetPath = path.join(canonicalSkillDir, 'assets', asset);
  if (!fs.existsSync(assetPath)) {
    error(`Missing asset: assets/${asset}`);
  } else {
    success(`Verified asset: assets/${asset}`);
  }
}

console.log('\n--- Validation Result ---');
if (hasErrors) {
  console.error('❌ Validation failed with errors.');
  process.exit(1);
} else {
  console.log('🎉 All Swarm Animation Skill integrity checks passed!\n');
  process.exit(0);
}
