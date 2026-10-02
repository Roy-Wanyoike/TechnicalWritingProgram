# 🌐 TechWritingPrograms Website

A zero-dependency static site (HTML + CSS + vanilla JS) that renders the full
directory of paid technical writing programs from `data.js`.

No build step. No framework. Deploy anywhere static files are served.

## Deploy to Vercel (60 seconds)

> **Zero-config:** the repo root has a `vercel.json` that points Vercel at
> `website/` automatically — importing the repo and clicking Deploy is enough.

### Option A — Dashboard
1. Push this repo to GitHub (already done if you're reading this in the repo).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Leave all settings at their defaults — **or** set **Root Directory** to `website` (both work).
4. Click **Deploy**. Done — you'll get a `your-repo.vercel.app` URL.

> **Already deployed and seeing a 404?** Your project was created before the
> root `vercel.json` existed. Either push/redeploy to pick it up, or go to
> *Project → Settings → General → Root Directory*, set it to `website`, save,
> then hit **Redeploy** from the Deployments tab.

### Option B — CLI
```bash
npm i -g vercel
cd website
vercel --prod
```

### One-click button for the README
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Roy-Wanyoike/Technical-writing-platforms&project-name=tech-writing-programs&repository-name=Technical-writing-platforms&root-directory=website)
```
The `root-directory=website` parameter pre-configures the clone dialog for you.

## Updating data

All content lives in [`data.js`](./data.js). It is regenerated from the repo's
master dataset — edit the main `Readme.md` via PR, or edit `data.js` directly
and open a PR. The page re-renders automatically from the arrays:

- `PROGRAMS` — paying programs (`status`: active/paused/closed, `category`: company/agency/publication)
- `FREE_PLATFORMS` — free publishing platforms
- `MARKETPLACES` — freelance marketplaces
- `RESOURCES` — further reading

## Local preview

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

(Opening `index.html` directly via file:// also works.)

## Features

- 🔍 Instant search across names, topics, rates and notes
- ✅ Status filters (Active / Paused / Closed) + category filters
- ↕️ Sort by highest pay or A→Z
- 🌙 Dark mode (respects system preference, persisted)
- 📱 Fully responsive, accessible (ARIA labels, keyboard nav, reduced motion)
- ⚡ Zero dependencies — one HTML file, one CSS file, two JS files
