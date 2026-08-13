# act-sec

Two completely separate applications live here:

- **`site/`** — the public portfolio. An Astro static site, deployed to GitHub
  Pages. This is the only thing that ever gets pushed to GitHub.
- **`admin/`** — a local-only admin dashboard used to author content
  (projects, certifications, blog posts, papers, site settings) and to
  publish it by committing and pushing `site/` to GitHub. `admin/` has its
  own separate local git history and is **never** pushed anywhere — it has
  no GitHub remote, ever.

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

1. Create a new **empty** repository on GitHub named `act-sec` (or update
   `base` in `site/astro.config.mjs` and `SITE_REPO_PATH`'s remote to match
   whatever name you actually use).
2. In `site/astro.config.mjs`, set `site` to `https://<your-username>.github.io`.
3. From inside `site/`:
   ```bash
   git init
   git add -A
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/act-sec.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages → Source → GitHub Actions**. The included
   workflow (`.github/workflows/deploy.yml`) builds and deploys on every
   push to `main`.
5. Your site will be live at `https://<your-username>.github.io/act-sec/`.

After this one-time setup, the admin dashboard's **Publish** button
(`git add -A && git commit && git push`, scoped only to `site/`) does steps
3–4 for you on every future content change.

## 2. Admin dashboard (`admin/`)

This app is **local-only**. It binds to `127.0.0.1` and must never be
exposed to the internet, put behind a public tunnel, or deployed anywhere.

```bash
cd admin
npm install
cp .env.example .env
# Generate a real secret and paste it into .env as SESSION_SECRET:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
# Point SITE_REPO_PATH in .env at the site/ folder (default ../site is correct
# if you keep the layout as-is).

npm run create-admin   # interactive prompt to create your first admin account
npm start               # http://127.0.0.1:4322
```

Log in, and you'll be offered optional TOTP 2FA setup under **Account**
(scan the QR code with an authenticator app; save the recovery codes shown
once, they're not shown again).

### What the admin app enforces

- Argon2id password hashing, no public registration route (accounts are only
  ever created via `npm run create-admin` on the local machine).
- SQLite-backed sessions with rolling idle timeout + absolute session
  lifetime, session ID regenerated on login.
- CSRF tokens on every state-changing form.
- Optional TOTP 2FA with hashed, single-use recovery codes.
- Rate limiting + escalating account lockout on `/login` and `/login/verify-2fa`.
- Full audit log (`audit_log` table, viewable under **Audit Log**) of every
  auth event and content mutation, plus a mirrored append-only file at
  `admin/logs/audit.log`.

### How content flows to the public site

Every CRUD action in the dashboard (Projects, Certifications, Blog Posts,
Papers, Site Settings) writes directly into `site/src/content/...` (or
`site/src/site.data.json` / `site/public/...` for settings and uploads) via
`admin/src/services/contentWriter.js`. Nothing is live until you click
**Publish**, which runs `git add -A && git commit && git push` scoped
strictly to the `site/` directory (`admin/src/services/gitPublish.js`) —
it cannot see or touch `admin/`'s own repo.

## Directory layout

```
act-sec/
  site/     <- public, static, deployed to GitHub Pages
  admin/    <- local-only, own separate git history, never pushed anywhere
```
