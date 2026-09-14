# Contributing to Brandex Mail Merge

This is a small, purpose-built internal tool — "contributing" here mainly
means *safely making changes without breaking production for the firm*.
This guide exists so any future editor (including future-you) doesn't have
to rediscover the gotchas the hard way.

## Project Setup

There's no build step and no dependencies to install — this is deliberately
kept simple (plain HTML/CSS/JS + a single Google Apps Script file).

1. Clone the repo:

   ```bash
   git clone https://github.com/0utlawzz/Brandex-MailMerge.git
   cd Brandex-MailMerge
   ```

2. See `README.md` → **Architecture: Which File Goes Where** before touching
   anything — Apps Script and GitHub Pages files look similar but deploy
   completely differently.

## Making a Change

### If you're changing the web form or the CMS home page

Edit `trademark-application.html` or `index.html` directly, then:

```bash
git add .
git commit -m "Describe what changed and why"
git push
```

GitHub Pages redeploys automatically within a minute or two. Hard-refresh
the live page to confirm.

### If you're changing backend logic (document generation, Drive/Sheet behavior)

1. Edit `Brandex-MailMerge-Full.gs` **in this repo first** (so it stays the
   source of truth), then copy the entire file into the Apps Script
   editor's `Code.gs`.
2. `Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy`.
   **Do not create a brand-new deployment** — that generates a new URL and
   breaks the live form, which points at one fixed URL.
3. If you added/changed a Sheet column, run `📋 TRADEMARK TOOLS → 📊 Setup
   Headers` then `🔽 Setup Dropdowns` once from the Sheet's menu.
4. Commit the `.gs` change to GitHub too, so the repo and the live script
   never drift apart again.

### If you're changing `MAIN_FOLDER_ID`, `TM1_TEMPLATE_ID`, or `TM48_TEMPLATE_ID`

These must match in exactly **two** places, every time:

- The `⚙️ CONFIG` block at the top of `Brandex-MailMerge-Full.gs`
- The `Config IDs` section in `README.md` (for humans checking later)

If you also changed the Apps Script **deployment URL**, update it in a
**third** place: the `APPS_SCRIPT_URL` constant near the top of
`trademark-application.html`.

## Code Style

- New comments: professional English, prefixed by intent — `// FIX:`,
  `// NOTE:`, `// SECURITY:`. Older comments in this file are in Roman
  Urdu (written for the original non-developer maintainer) — leave those
  as historical context rather than rewriting them.

- Keep configuration values in exactly one place (the CONFIG block) —
  duplicated IDs/URLs are how most of this project's past bugs happened.

- `CLASS_DATA` and `CONSULTANT_DATA` are intentionally duplicated between
  `trademark-application.html` (runs in the browser) and
  `Brandex-MailMerge-Full.gs` (runs on Google's servers) — they can't share
  one copy across those two environments. **Update both when the master
  list changes.**

## Testing a Change Before Trusting It

There's no automated test suite (a full test harness would be overkill for
a tool this size). Manually verify instead:

1. Submit one real-looking test application through the live form.
2. Confirm in Drive: a single client folder was created (not a duplicate),
   containing the logo image, `TM-1`, and `TM-48`.
3. Confirm in the Sheet: the row shows `DONE ✅` and a `PENDING` filing
   status — not stuck on `ON IT 👉`.
4. Deliberately trigger a failure (e.g., temporarily break the folder ID)
   and confirm the row shows `ERROR ❌`, not silently reverting.
