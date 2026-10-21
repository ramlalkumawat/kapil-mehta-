/**
 * Switch Candidate Utility Script
 * Usage: node scripts/switch-candidate.js candidate-001
 * Updates .env with VITE_CANDIDATE_ID=<id>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const candidatesDir = path.resolve(__dirname, '../config/candidates');

const targetId = process.argv[2];

if (!targetId) {
  console.log('Usage: npm run switch-candidate <candidate-id>');
  console.log('Available candidates:');
  fs.readdirSync(candidatesDir)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''))
    .forEach(id => console.log(`  - ${id}`));
  process.exit(1);
}

const targetFile = path.join(candidatesDir, `${targetId}.js`);
if (!fs.existsSync(targetFile)) {
  console.error(`❌ Error: Candidate file "${targetId}.js" not found in config/candidates/`);
  process.exit(1);
}

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  const examplePath = path.resolve(__dirname, '../.env.example');
  if (fs.existsSync(examplePath)) {
    envContent = fs.readFileSync(examplePath, 'utf8');
  }
}

if (envContent.includes('VITE_CANDIDATE_ID=')) {
  envContent = envContent.replace(/VITE_CANDIDATE_ID=.*$/m, `VITE_CANDIDATE_ID=${targetId}`);
} else {
  envContent = `VITE_CANDIDATE_ID=${targetId}\n` + envContent;
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log(`✅ Successfully switched active candidate to "${targetId}" in .env!`);
