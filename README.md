# Karthick Raja Portfolio

A responsive personal portfolio website built with HTML, CSS, and JavaScript to showcase projects, skills, resume, and contact details.

## Overview

This portfolio is designed around a clean, modern single-page layout with:

- A hero section with role-focused headline and key tech tags
- About, Skills, Projects, Education, and Contact sections
- Project accordion cards with category filters
- Smooth scrolling, reveal animations, and back-to-top behavior
- Light/Dark theme toggle with saved preference
- Mobile-friendly navigation menu
- SEO metadata (Open Graph, Twitter Cards, canonical, JSON-LD)
- Accessibility-focused interactions (semantic accordion buttons, ARIA states)

## Tech Stack

- HTML5
- CSS3 (custom properties + responsive design)
- Vanilla JavaScript (no framework)
- Tabler Icons (CDN)
- Google Fonts

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- script.js
|-- .github/
|   `-- workflows/
|       `-- static-site-checks.yml
|-- .gitignore
|-- scripts/
	`-- update-sitemap-lastmod.mjs
|-- README.md
|-- robots.txt
|-- sitemap.xml
|-- _headers
`-- assets/
	|-- karthickraja.jpg
	|-- ats_resume_thumbnail.jpg
	|-- Karthick_Raja_DataAnalyst_Resume.pdf
	|-- bird_species_thumbnail.svg
	|-- api_project_thumbnail.svg
	|-- api_dashboard_traffic.png
	|-- sql_project_thumbnail.svg
	|-- stock_market_thumbnail.svg
	`-- sql-project/
		|-- README.md
		|-- 00_schema.sql
		|-- 00_reset_data.sql
		|-- 01_basic_analytics.sql
		|-- 02_advanced_analytics.sql
		|-- 03_kpi_analytics.sql
		`-- 04_master_analytics.sql
```

## Featured Projects

- API Performance Monitoring & Analytics System
- Stock Portfolio Analysis Dashboard (Excel)
- AI Bird Species Recognition System
- ATS Resume Analyzer

## Live Site

- Portfolio: https://karthickraja.page

## Run Locally

This is a static site, so you can run it in any of these ways:

1. Open `index.html` directly in a browser.
2. Run a local server:
	- VS Code Live Server, or
	- `python -m http.server 5500`
3. Open `http://localhost:5500`.

## Customization

- Update profile details and section content in `index.html`.
- Adjust colors, spacing, and responsive behavior in `style.css`.
- Modify interactions (theme toggle, filters, menu, animations) in `script.js`.
- Replace resume and project thumbnails in the `assets/` folder.
- Keep resume file at `assets/Karthick_Raja_DataAnalyst_Resume.pdf` and update `RESUME_ASSET_PATH` in `script.js` if the filename changes.

## SQL Analytics Package

- SQL scripts are in `assets/sql-project/`.
- Follow execution order and assumptions documented in `assets/sql-project/README.md`.

## Maintenance

- Keep sitemap date fresh with `node scripts/update-sitemap-lastmod.mjs`.
- CI enforces fresh sitemap metadata with `node scripts/update-sitemap-lastmod.mjs --check`.

## Production Security Headers

For production hosting, configure security headers at your CDN/hosting layer.
This repo includes an optional `_headers` file for platforms that support it (for example, Netlify or Cloudflare Pages).

- `Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

If you use GitHub Pages, apply these via a reverse proxy/CDN like Cloudflare.

## Change Log

- May 2026: Bug fixes for CSS variables and project filter deep links.
- May 2026: Added SEO metadata improvements (canonical, absolute OG/Twitter image, JSON-LD).
- May 2026: Improved accessibility semantics for accordion and mobile navigation.
- May 2026: Added skip link, reduced-motion handling, aria-current updates, and static validation.
- May 2026: Added HTML/CSS/JS validation workflow and lighter API thumbnail asset.
- May 2026: Updated README and SQL documentation.
- May 2026: Implemented visible skip link, optimized custom cursor rendering, dynamic theme-color updates, and sitemap freshness checks.

## Contact

- GitHub: https://github.com/KarthickRaja46
- LinkedIn: https://www.linkedin.com/in/karthick-raja-l-7a5b3a26b/
- Email: karthiikarthii46@gmail.com

## License

This project is for personal portfolio use.