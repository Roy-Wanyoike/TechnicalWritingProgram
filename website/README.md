# 🌐 TechWritingPrograms Website

A zero-dependency static site (HTML + CSS + vanilla JS) that renders the full
directory of paid technical writing programs from `data.js`.

No build step. No framework. Deploy anywhere static files are served.

## Deploy to Vercel (60 seconds)

### Option A — Dashboard
1. Push this repo to GitHub (already done if you're reading this in the repo).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set **Root Directory** to `website`.
4. Click **Deploy**. Done — you'll get a `your-repo.vercel.app` URL.

### Option B — CLI
```bash
npm i -g vercel
cd website
vercel --prod
```

### One-click button for the README
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Roy-Wanyoike/TechnicalWritingProgram&project-name=tech-writing-programs&repository-name=TechnicalWritingProgram)
```
(Set "Root Directory" to `website` in the clone dialog.)

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
