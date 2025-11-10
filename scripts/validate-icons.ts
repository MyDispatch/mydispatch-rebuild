import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src');
const forbiddenPatterns = [
  /text-status-(success|warning|error)/,
  /text-(red|green|yellow|blue)-(100|200|300|400|500|600|700|800|900)/,
  /text-slate-(\d{3})/, // direkte Slate-Farben auf Icons sind nicht erlaubt
];

const iconTagPatterns = [
  /<([A-Z][A-Za-z0-9_]*)\s+[^>]*className=\"([^\"]*)\"/g, // JSX mit className
  /<svg\s+[^>]*class=\"([^\"]*)\"/g, // Rohes SVG
];

function walk(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.isFile() && /\.(tsx|ts|jsx|js)$/.test(e.name)) files.push(full);
  }
  return files;
}

function checkFile(file: string) {
  const content = fs.readFileSync(file, 'utf-8');
  const violations: string[] = [];
  for (const tagPattern of iconTagPatterns) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(tagPattern);
    while ((match = regex.exec(content)) !== null) {
      const classAttr = match[2] || match[1] || '';
      for (const fp of forbiddenPatterns) {
        if (fp.test(classAttr)) {
          violations.push(`Icon in ${file} uses forbidden class: "${classAttr}"`);
          break;
        }
      }
    }
  }
  return violations;
}

function main() {
  const files = walk(ROOT);
  const allViolations = files.flatMap(checkFile);
  if (allViolations.length > 0) {
    console.error('Icon color violations found:');
    for (const v of allViolations) console.error(`- ${v}`);
    process.exit(1);
  } else {
    console.log('✅ No forbidden icon color classes found.');
  }
}

main();

