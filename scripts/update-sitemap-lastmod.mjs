import { readFile, writeFile } from 'node:fs/promises';

const SITEMAP_PATH = 'sitemap.xml';
const LASTMOD_PATTERN = /<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/;
const today = new Date().toISOString().slice(0, 10);
const checkOnly = process.argv.includes('--check');

const sitemap = await readFile(SITEMAP_PATH, 'utf8');
const match = sitemap.match(LASTMOD_PATTERN);

if (!match) {
  throw new Error('Could not find <lastmod> in sitemap.xml');
}

const currentDate = match[1];

if (currentDate === today) {
  console.log(`Sitemap lastmod is current (${today}).`);
  process.exit(0);
}

if (checkOnly) {
  throw new Error(`Sitemap lastmod is stale (${currentDate}); expected ${today}. Run: node scripts/update-sitemap-lastmod.mjs`);
}

const updated = sitemap.replace(LASTMOD_PATTERN, `<lastmod>${today}</lastmod>`);
await writeFile(SITEMAP_PATH, updated, 'utf8');
console.log(`Updated sitemap lastmod from ${currentDate} to ${today}.`);
