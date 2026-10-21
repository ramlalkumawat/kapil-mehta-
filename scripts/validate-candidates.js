/**
 * Candidate Configuration Validator CLI Script
 * Scans all files in config/candidates/ and reports validity against schema.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateCandidateConfig } from '../config/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const candidatesDir = path.resolve(__dirname, '../config/candidates');

console.log('🔍 Validating Candidate Configurations...\n');

const files = fs.readdirSync(candidatesDir).filter(f => f.endsWith('.js'));
let hasFailure = false;

for (const file of files) {
  const filePath = path.join(candidatesDir, file);
  try {
    const fileUrl = new URL(`file://${filePath}`).href;
    const module = await import(fileUrl);
    const config = module.default;

    const result = validateCandidateConfig(config);
    if (result.valid) {
      console.log(`✅ [PASS] ${file} (ID: ${config.id || 'N/A'})`);
      if (result.warnings.length > 0) {
        result.warnings.forEach(w => console.log(`   ⚠️ Warning: ${w}`));
      }
    } else {
      hasFailure = true;
      console.error(`❌ [FAIL] ${file}`);
      result.errors.forEach(e => console.error(`   🛑 Error: ${e}`));
    }
  } catch (err) {
    hasFailure = true;
    console.error(`❌ [ERROR] Could not load ${file}:`, err.message);
  }
}

console.log('\n----------------------------------------');
if (hasFailure) {
  console.error('❌ Validation completed with errors.');
  process.exit(1);
} else {
  console.log('✨ All candidate configurations are valid!');
  process.exit(0);
}
