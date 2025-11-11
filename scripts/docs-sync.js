#!/usr/bin/env node
/**
 * MD-2024 Docs Sync Script
 * - Scans /docs for Markdown files
 * - Extracts MD-2024 metadata & sections
 * - Dry-run mode prints summary; push mode upserts into Supabase wiki_documents
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function readAllMarkdown(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(readAllMarkdown(full));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) files.push(full);
  }
  return files;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function parseMd2024(md) {
  const lines = md.split(/\r?\n/);
  const titleLine = lines.find(l => /^#\s+/.test(l)) || '';
  const title = titleLine.replace(/^#\s+/, '').trim();

  const getField = (label) => {
    const rx = new RegExp(`^${label}:\s*(.+)$`, 'i');
    const line = lines.find(l => rx.test(l));
    return line ? line.replace(rx, '$1').trim() : undefined;
  };

  const status = getField('Status');
  const version = getField('Version');
  const date = getField('Datum');
  const author = getField('Autor');

  // Capture known sections by headings
  function captureSection(header) {
    const startIdx = lines.findIndex(l => new RegExp(`^##\s+${header}\b`).test(l));
    if (startIdx === -1) return undefined;
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^##\s+/.test(lines[i])) { endIdx = i; break; }
    }
    return lines.slice(startIdx + 1, endIdx).join('\n').trim();
  }

  const sections = {
    Zusammenfassung: captureSection('Zusammenfassung'),
    Details: captureSection('Details'),
    Validierung: captureSection('Validierung'),
    Referenzen: captureSection('Referenzen')
  };

  // Tags: derive from path and headings (basic)
  const tags = [];
  if (/policy/i.test(title)) tags.push('policy');
  if (/architektur|architecture/i.test(title)) tags.push('architecture');
  if (/changelog/i.test(title)) tags.push('changelog');

  return { title, status, version, date, author, sections, tags };
}

function getEnv(name, fallback) {
  return process.env[name] || fallback;
}

async function main() {
  const root = process.cwd();
  const docsDir = path.join(root, 'docs');
  const dryRun = process.argv.includes('--dry');
  const push = process.argv.includes('--push');
  const projectUrl = getEnv('SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!fs.existsSync(docsDir)) {
    console.error('docs/ directory not found.');
    process.exit(1);
  }

  const files = readAllMarkdown(docsDir);
  const results = [];

  let supabase = null;
  if (push) {
    if (!projectUrl || !serviceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for push.');
      process.exit(1);
    }
    supabase = createClient(projectUrl, serviceKey);
  }

  for (const file of files) {
    const relPath = path.relative(root, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const hash = sha256(content);
    const meta = parseMd2024(content);

    const payload = {
      path: relPath,
      title: meta.title,
      status: meta.status,
      version: meta.version,
      date: meta.date ? new Date(meta.date) : null,
      author: meta.author,
      summary: meta.sections.Zusammenfassung,
      sections: meta.sections,
      references: meta.sections.Referenzen ? meta.sections.Referenzen.split('\n').filter(Boolean) : [],
      tags: meta.tags,
      content_md: content,
      content_hash: hash,
      validated_at: null
    };

    results.push({ path: relPath, title: meta.title });

    if (push && supabase) {
      const { error } = await supabase
        .from('wiki_documents')
        .upsert(payload, { onConflict: 'path' });
      if (error) {
        console.error(`Upsert failed for ${relPath}:`, error.message);
      }
    }
  }

  console.log(JSON.stringify({ filesProcessed: files.length, docs: results }, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
