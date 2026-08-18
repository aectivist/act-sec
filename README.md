# act-sec

Two applications live here, kept structurally isolated:

- **`site/`** — the public portfolio. An Astro static site, deployed to GitHub
  Pages.
- **`admin/`** — a local-only admin dashboard used to author content
  (projects, certifications, blog posts, papers, site settings) and to
  publish it by committing and pushing to GitHub.

This repo's root (not `site/`) is what's actually connected to GitHub. The
root **`.gitignore` excludes `admin/` entirely** — it is not possible for
`admin/`'s code, data, or logs to end up in a commit here, regardless of
which tool (this admin app, `git` directly, GitHub Desktop, ...) triggers
it. `admin/src/services/gitPublish.js` also double-checks this itself before
every commit and refuses to proceed if it ever finds `admin/` staged.

## 1. Public site (`site/`)

```bash
cd site
npm install
npm run dev       # http://localhost:4321/act-sec
npm run build     # outputs to site/dist
npm run preview   # preview the production build
```

### Customizing

- **Identity, about text, contact, socials, nav**: edit `site/src/site.data.json`
  directly, or use the admin dashboard's **Site Settings** page — both do the
  same thing.
- **Logo**: replace `site/public/logo.svg` (or upload a new one via Site
  Settings, any of SVG/PNG/JPG/WebP).
- **Theme colors**: CSS variables in `site/src/styles/theme.css`, or set
  `themeOverrides` in `site.data.json` to override `accent`, `accentSoft`,
  `bg`, `bgElevated` at runtime.
- **Content**: markdown files under `site/src/content/{blog,projects,certifications,papers}/`.
  Add/edit these by hand, or through the admin dashboard.

### Connecting to GitHub Pages

1. Create a new repository on GitHub (**public** — GitHub Pages on a free
   account requires it) and connect this project's root to it as `origin`.
2. In `site/astro.config.mjs`, set `site` to `https://<your-username>.github.io`
   and `base` to match your repo name.
3. On GitHub: **Settings → Pages → Source → GitHub Actions**. The included
   workflow (`.github/workflows/deploy.yml`, at the repo root) builds `site/`
   and deploys on every push to `main` — it also auto-enables Pages itself
   (`enablement: true`) if that step hasn't been done yet.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

After this one-time setup, the admin dashboard's **Publish** button
(`git add -A && git commit && git push`, scoped to this repo root, with
`admin/` structurally excluded as above) does step 3 for you on every future
content change.

## 2. Admin dashboard (`admin/`)

```bash
cd admin
npm install
cp .env.example .env
# Point SITE_REPO_PATH in .env at the repo root (default .. is correct if
# you keep the layout as-is).

npm start   # http://127.0.0.1:4322
```

### ⚠️ There is no login

This app has **no authentication at all** — no password, no session, nothing.
Its *only* protection is that it binds to `127.0.0.1` (`app.js`), so nothing
outside the local machine can reach it. This is a deliberate tradeoff made
for a single local user's convenience, not an oversight — but it means:

- **Never** change the bind address in `app.js` away from `127.0.0.1`.
- **Never** put this behind a tunnel, reverse proxy, port-forward, or
  anything else that makes it reachable from another device.
- **Never** run it on a shared/multi-user machine, or trust it on a machine
  where you'd run untrusted software — any local process or user account can
  reach it exactly as easily as you can.
- A malicious webpage open in the same browser could still try to submit
  requests to `http://127.0.0.1:4322` purely because it's on localhost
  (browsers don't block that). The one remaining defense against that is an
  Origin/Referer check on all state-changing requests
  (`admin/src/middleware/originCheck.js`) — it has no dependency on
  login/sessions and stays in place regardless.

### What's still in place

- Security headers via Helmet (CSP, etc.).
- Origin/Referer verification on every POST/PUT/PATCH/DELETE, rejecting
  anything whose origin doesn't match this server.
- An append-only audit log (`audit_log` table, viewable under **Audit Log**,
  plus a mirrored file at `admin/logs/audit.log`) of every content mutation
  and publish attempt.

### How content flows to the public site

Every CRUD action in the dashboard (Projects, Certifications, Blog Posts,
Papers, Site Settings) writes directly into `site/src/content/...` (or
`site/src/site.data.json` / `site/public/...` for settings and uploads) via
`admin/src/services/contentWriter.js`. Nothing is live until you click
**Publish**, which commits and pushes the repo root (`admin/src/services/gitPublish.js`)
— `admin/` itself is excluded from that commit no matter what, per the
isolation model described above.

## Directory layout

```
act-sec/                 <- this is the git repo connected to GitHub
  .gitignore              <- excludes admin/ completely
  .github/workflows/      <- deploy.yml builds+deploys site/ only
  site/                   <- public, static, deployed to GitHub Pages
  admin/                  <- local-only, gitignored, no login — see warning above
```
