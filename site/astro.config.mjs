import { defineConfig } from 'astro/config';

// Custom domain (www.act-sec.com) — GitHub Pages serves a custom domain from
// the domain root, unlike a project page (which lives under /act-sec/), so
// `base` must be '/' here. The CNAME file in public/ is what tells GitHub
// Pages to use this domain; it must survive every deploy, hence it living in
// public/ rather than being a one-off repo settings change.
export default defineConfig({
  site: 'https://www.act-sec.com',
  base: '/',
  trailingSlash: 'ignore',
});
