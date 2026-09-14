# Security Policy

## Scope

This project is an internal tool for Brandex Law Associates. It handles
client trademark filing data (names, CNIC numbers, addresses, and unfiled
trademark logo images), so security issues here can expose confidential,
not-yet-filed client information.

## Reporting a Vulnerability

If you find a security issue — for example, a way to access another
client's folder, documents, or images without authorization, or a way to
make the Apps Script backend leak data it shouldn't — please report it
privately rather than opening a public GitHub issue:

- Open a private conversation with the repository owner ([@0utlawzz](https://github.com/0utlawzz)), or
- Email the maintainer directly if you have their contact details.

Please include:
1. What you found and why it's a security issue.
2. Steps to reproduce it.
3. Any suggested fix, if you have one.

We'll acknowledge reports as soon as possible and fix confirmed issues
promptly, given this handles real client data.

## Known Design Notes (not vulnerabilities, but worth knowing)

- Uploaded trademark logo images are **intentionally never made public**
  ("anyone with link") — they are embedded directly into the generated
  Google Docs only. See `README.md` → *Image behavior*.
- The Apps Script backend uses `/** @OnlyCurrentDoc */` to keep its
  authorization scope as narrow as Apps Script allows for a bound script.
- The web app URL (`APPS_SCRIPT_URL` in `trademark-application.html`) is
  a public endpoint by necessity (the form is public-facing). It only
  accepts a fixed `action: "generateFromForm"` payload shape — it does not
  expose arbitrary Drive or Sheet access.
