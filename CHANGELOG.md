# Changelog

All notable changes to **Brandex MailMerge** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-09-14

### 🚀 First Stable Release

This release marks the production-hardened, fully polished version of the
Brandex Trademark Application Generator — a tool that eliminates manual
retyping of client data across TM-1 and TM-48 official forms.

---

### Fixed

- **CRITICAL — Duplicate client folders**: Google Drive's `createFolder()` never
  throws on duplicate names, silently creating a new folder every time. The
  old code used `try { createFolder() } catch { find }` — since the catch
  never ran, a new duplicate-named folder was created on every submission.
  Replaced with `getOrCreateClientFolder()`: always searches for an existing
  folder first, only creates if none found. *(Commits: multiple sessions)*

- **CRITICAL — Hardcoded IDs in 4 separate locations**: `MAIN_FOLDER_ID`,
  `TM1_TEMPLATE_ID`, and `TM48_TEMPLATE_ID` were copy-pasted into 4 different
  functions (3 as variable declarations, 1 as a raw string in `uploadToDrive()`).
  Changing the ID in one place left the others pointing at the old value.
  Consolidated into a single `⚙️ CONFIG` block at the top of the script. All
  functions now reference the global variables — one change updates everything.

- **Image confidentiality**: Uploaded trademark logos were being made
  `ANYONE_WITH_LINK` (publicly viewable) via `file.setSharing()`. A client's
  unfiled trademark logo should never be publicly accessible. Removed the
  sharing call entirely — images are embedded into documents by reference and
  remain private within the firm's Drive.

- **Silent failure on image upload**: If the image save failed, the script only
  logged to `Logger` and still returned "DONE ✅" to the frontend. The root
  cause was invisible. Added `imageWarning` field to the response — frontend
  now displays an orange warning alongside the success message if image saving
  failed.

- **Row stuck on "ON IT 👉" after failure**: If `processRow()` or
  `processRowAndReturnLinks()` threw an error mid-way, the row's STATUS column
  was never updated from `ON IT 👉`, making it look like it was still processing.
  All three processing paths (web form, Process One menu, Process All bulk) now
  explicitly set `ERROR ❌` on any exception.

- **Corrupted `trademark-application.html`**: File had ~44,000 bytes of duplicate
  CSS/HTML appended after the closing `</html>` tag. Truncated to correct content.

- **`SECURITY.md` corruption**: File was 4.4 MB (binary/corrupt). Replaced with a
  proper, concise security policy document.

---

### Added

- **FILING PROCESS column (Column V)**: A second, independent status column for
  manual office tracking. Values: `PENDING` → `DISPATCHED 📬` / `REVIEW` /
  `REJECTED ❌`. Set automatically to `PENDING` on every new web-form submission.
  The automation never changes it after that — office staff update it directly in
  the Sheet.

- **4-state STATUS system**: Standardized `START 💫` → `ON IT 👉` → `DONE ✅` /
  `ERROR ❌`. Added `ERROR ❌` as a fourth state with dropdown validation and
  conditional formatting (light red row highlight).

- **`@OnlyCurrentDoc` security annotation**: Restricts the script's authorization
  scope to only the bound spreadsheet, reducing blast radius.

- **Single CONFIG block**: `MAIN_FOLDER_ID`, `TM1_TEMPLATE_ID`, `TM48_TEMPLATE_ID`
  now live in exactly one place — the `⚙️ CONFIG` section at the top of
  `Brandex-MailMerge-Full.gs`. Update once, applies everywhere.

- **Class/Consultant auto-fill in the Sheet**: Added `onEdit()` trigger so selecting
  a class number in Column G auto-fills the description in Column H, and selecting
  a consultant in Column R auto-fills their address in Column S — mirroring the
  web form's behavior for rows entered directly in the Sheet.

- **Dropdown validation for CLASS and CON-NAME**: Column G now only accepts valid
  Nice Classification numbers (1–45). Column R suggests known consultants but
  allows manual entry (`allowInvalid: true`).

- **Formatting via `setupSpreadsheet()`**: Heading row uses "Ysabeau SC" font on
  a dark background; body rows use "Times New Roman", left-aligned, CLIP wrap
  strategy (no text overflow into adjacent cells).

- **Toast notifications**: `setupSpreadsheet()` and `setupDropdowns()` now show
  a non-blocking sheet toast instead of a blocking `alert()` dialog.

- **Success screen redesign**: On successful generation, the frontend now displays
  the **Application/Mark Name**, **Applicant Name**, and **Class** prominently —
  instead of just a serial number and row index (which are internal references
  of no value to the user).

- **Menu icons**: Sheet menu updated to `📋 TRADEMARK TOOLS` with `📊 Setup Headers`
  and `🔽 Setup Dropdowns` icons.

- **`LICENSE`** (MIT), **`CONTRIBUTING.md`**, **`SECURITY.md`**, **`CHANGELOG.md`**:
  Full GitHub community standards documentation added.

- **`README.md` rewrite**: Professional README with problem/solution framing,
  file-placement table ("which file goes where"), config sync instructions,
  status system documentation, and CMS menu reference.

---

### Removed

- **Sidebar Image Uploader** (`showImageUploader`, `uploadToDrive`,
  `writeImageIdToSheet`): This tool saved images to the MAIN folder root
  (not inside the client folder), was not connected to any menu, and is no
  longer needed since all uploads flow through the web form. Removed cleanly.
  Historical copy available in the Claude conversation referenced in the
  project's commit history.

---

### Architecture

| File | Location | Purpose |
|------|----------|---------|
| `Brandex-MailMerge-Full.gs` | Google Apps Script (`Code.gs`) | Backend |
| `trademark-application.html` | GitHub Pages | Public web form |
| `index.html` | GitHub Pages | CMS home / links hub |
| `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`, `CHANGELOG.md` | GitHub | Documentation |

---

[1.0.0]: https://github.com/0utlawzz/Brandex-MailMerge/releases/tag/v1.0.0
