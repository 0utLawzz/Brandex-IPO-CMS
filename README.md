# Brandex Mail Merge

![Version](https://img.shields.io/badge/version-1.2.0-0D9970)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-production-C94A00)

Neo-Brutalism CMS for **Brandex Law Associates** — a trademark application
generator, plus a links hub to the firm's other internal tools.

## The Problem

Filing a trademark application means retyping the same client details —
name, CNIC, class, consultant, dates — into multiple official forms
(TM-1, TM-48) by hand, every single time. Manual retyping is slow and
invites exactly the kind of small transcription error a law firm cannot
afford in a legal filing.

## The Solution

Fill the client's details out **once**, in one web form. This tool:
- Auto-fills known/repeated data (Nice Classification class descriptions,
  consultant name & address) so nobody retypes boilerplate text.
- Generates both official documents from a **single template each** —
  update the Google Doc template once, and every future filing picks up
  the change automatically.
- Keeps every generated file organized in one Drive folder per client,
  and one row per client in a shared Sheet for tracking.
- The same underlying engine also supports **bulk processing** directly
  from the Sheet (`Process One` / a bulk mode) for cases entered outside
  the web form — one template, unlimited generations, no re-typing.

## Live Pages

> CMS Home:
> https://0utlawzz.github.io/Brandex-MailMerge/

> Trademark Application Form:
> https://0utlawzz.github.io/Brandex-MailMerge/trademark-application.html

## Architecture: Which File Goes Where

This project spans **two separate platforms** — mixing them up is the
single most common source of confusion on this repo.

| File | Lives in | Purpose |
|---|---|---|
| `Brandex-MailMerge-Full.gs` | **Google Apps Script** (paste into `Code.gs`) | Backend: Sheet logic, Drive folder/file handling, document generation, `doPost()` web endpoint |
| `trademark-application.html` | **GitHub Pages** (this repo) | Public-facing web form |
| `index.html` | **GitHub Pages** (this repo) | CMS home page / links hub |
| `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE` | **GitHub** (this repo) | Documentation only — never copied into Apps Script |
| ~~`ImageUploader.html`~~ | *(deprecated — delete from Apps Script if present)* | Old sidebar upload tool, no longer used |

**Nothing from Apps Script belongs on GitHub Pages, and nothing from
GitHub Pages belongs inside the Apps Script project**, except that the two
sides must agree on shared values — see the next section.

## Keeping Config in Sync (read this before changing an ID)

`MAIN_FOLDER_ID`, `TM1_TEMPLATE_ID`, and `TM48_TEMPLATE_ID` must be
identical in these places. **Update every time you change one:**

1. The `⚙️ CONFIG` block at the very top of `Brandex-MailMerge-Full.gs`
2. The `Config IDs` table below (this file — for humans checking later)

If you change the **Apps Script deployment URL**, update it in a third
place too: `APPS_SCRIPT_URL` near the top of `trademark-application.html`.

### Config IDs

```text
MAIN_FOLDER_ID   = "1R-cQ1qYLat0DlnYKs699kXBX0zr7BZDP"
TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE"
TM48_TEMPLATE_ID = "1HyQyz-_tMFIy1X1bH0-sAToZmE2QJL5NFhGUwI_vLgE"
```

### Current Deployment URL

```text
https://script.google.com/macros/s/AKfycbyUMRVcdasDxGIaaPKbSzhEVbkKyMyYLNv4-NQ8pyGJEjWOukRPzS3Pt5Da6_CdNmP33Q/exec
```

## How to Deploy a Backend Change

1. Open the Google Sheet → Extensions → Apps Script.
2. Replace the entire contents of `Code.gs` with `Brandex-MailMerge-Full.gs` from this repo.
3. `Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy`.
   **Saving alone is not enough** — the web app keeps running the old code
   until a new version is deployed.
4. If a Sheet column changed, run `📋 TRADEMARK TOOLS → 📊 Setup Headers`,
   then `🔽 Setup Dropdowns`, once.

## Status System (Column A)

Four states only, set automatically:

`START 💫` → `ON IT 👉` → `DONE ✅` **or** `ERROR ❌`

Any failure — sheet menu, bulk, or web form — leaves the row on
`ERROR ❌` (highlighted light red) instead of silently reverting or
getting stuck on `ON IT 👉`.

## Filing Process (Column V)

A second, **independent** status column for manual office tracking — the
automation never changes it except to set `PENDING` on a brand-new
submission:

`PENDING` → `DISPATCHED 📬` / `REVIEW` / `REJECTED ❌` *(set by staff, directly in the Sheet)*

## Image Behavior

- Creates or reuses the client's folder under `MAIN_FOLDER_ID` (never
  creates a duplicate-named folder for the same client).
- Saves the uploaded trademark logo **directly inside that client folder**
  as `FOLDERNAME_logo.{png|jpg|gif|webp}`.
- Embeds the image into TM-1 and TM-48; the image file itself is **never
  made public** ("anyone with link") — a client's unfiled trademark stays
  private, visible only within the firm's Drive.

## Trademark Application Form — Field Behavior

- **Class**: dropdown of all 45 Nice Classification classes (1–34 Goods,
  35–45 Services). Selecting a class auto-fills the description; click
  **✏️ Edit** to type a custom/partial description instead.
- **Consultant**: dropdown of the firm's known consultants/agents.
  Selecting one auto-fills name + address; click **✏️ Edit** to enter one
  not yet in the list.
- **CNIC**: auto-formats to `#####-#######-#` as you type.
- **E-Stamp Issue Date**: defaults to now; **Expiry Date** is always
  Issue + 7 days, calculated automatically.
- **Using Year / Since**: free text with a suggested-years dropdown.

The same Class/Consultant auto-fill also works **directly in the Sheet**
(not just the web form) — selecting a class or consultant in the relevant
column fills in the matching description/address automatically.

## CMS Home Page — Menu

1. Trademark™ Application Generator
2. Journal Publishing Unit *(coming soon)*
3. Database Record CMS
4. Salary Logger
5. Ledger Consultants (Google Sheet)
6. Ledger Personal (Google Sheet)
7. Tools: Document Enhancer

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how changes are made and
deployed safely.

## Security

See [SECURITY.md](SECURITY.md) for how to report a security issue —
this project handles confidential, not-yet-filed client trademark data.

## Social

This project includes social media preview assets in the `social` directory
(e.g., `social-preview.png`) for promotional purposes.

## License

[MIT](LICENSE) © 2026 Brandex Law Associates
