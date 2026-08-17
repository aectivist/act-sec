import { defineConfig } from 'astro/config';

// Project page (not username.github.io), so GitHub Pages serves this at
// https://<username>.github.io/act-sec/ — keep `base` in sync with the repo name.
// If you rename the repo or switch to a custom domain / user page, update `site` and `base`.
export default defineConfig({
  site: 'https://aectivist.github.io',
  base: '/act-sec',
  trailingSlash: 'ignore',
});
