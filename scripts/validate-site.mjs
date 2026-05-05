import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const [indexHtml, styleCss, scriptJs] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('style.css', 'utf8'),
  readFile('script.js', 'utf8')
]);

assert(indexHtml.includes('fetchpriority="high"'), 'Hero image should use fetchpriority="high"');
assert(indexHtml.includes('assets/api_project_thumbnail.svg'), 'API project thumbnail should use the SVG asset');
assert(indexHtml.includes('class="skip-link"'), 'Skip link is missing');

assert(styleCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion CSS block missing');
assert(styleCss.includes('[aria-current="page"]'), 'ARIA current nav state styling missing');
assert(styleCss.includes('.skip-link'), 'Skip link styles missing');

assert(scriptJs.includes("setAttribute('aria-current', 'page')"), 'ARIA current updates missing');
assert(scriptJs.includes("behavior: prefersReducedMotion ? 'auto' : 'smooth'"), 'Reduced-motion-aware scrolling missing');
assert(scriptJs.includes("meta[name=\"theme-color\"]"), 'Theme-color meta update logic missing');
assert(scriptJs.includes('requestAnimationFrame(renderCursor)'), 'Optimized cursor render loop missing');

console.log('Static site validation passed.');