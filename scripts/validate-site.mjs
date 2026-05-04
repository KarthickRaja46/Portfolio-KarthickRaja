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

assert(indexHtml.includes('<a class="skip-link" href="#mainContent">Skip to content</a>'), 'Missing skip link');
assert(indexHtml.includes('<main id="mainContent" tabindex="-1">'), 'Main landmark must be focusable');
assert(indexHtml.includes('fetchpriority="high"'), 'Hero image should use fetchpriority="high"');
assert(indexHtml.includes('assets/api_project_thumbnail.svg'), 'API project thumbnail should use the SVG asset');

assert(styleCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion CSS block missing');
assert(styleCss.includes('.skip-link'), 'Skip-link styles missing');
assert(styleCss.includes('[aria-current="page"]'), 'ARIA current nav state styling missing');

assert(scriptJs.includes("setAttribute('aria-current', 'page')"), 'ARIA current updates missing');
assert(scriptJs.includes("behavior: prefersReducedMotion ? 'auto' : 'smooth'"), 'Reduced-motion-aware scrolling missing');

console.log('Static site validation passed.');