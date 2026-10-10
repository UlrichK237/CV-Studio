const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', 'html2canvas', 'dist', 'html2canvas.js'),
  path.join(__dirname, '..', 'node_modules', 'html2canvas', 'dist', 'html2canvas.esm.js'),
  path.join(__dirname, '..', 'node_modules', '.vite', 'deps', 'html2canvas.js'),
];

const needle = 'throw new Error("Attempting to parse an unsupported color function \\"" + value.name + "\\"");';
const replacement = 'return 0;';

let patchedCount = 0;

for (const target of targets) {
  if (fs.existsSync(target)) {
    let content = fs.readFileSync(target, 'utf8');
    if (content.includes(needle)) {
      content = content.replace(needle, replacement);
      fs.writeFileSync(target, content, 'utf8');
      console.log(`[patch-html2canvas] Successfully patched: ${target}`);
      patchedCount++;
    } else {
      console.log(`[patch-html2canvas] Already patched or needle not found: ${target}`);
    }
  }
}

console.log(`[patch-html2canvas] Done. Patched ${patchedCount} files.`);
