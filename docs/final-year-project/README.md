# Final Year Project Report Materials

This folder holds write-up material for the FAEAS final year project report, kept alongside the code so the figures stay in sync with what was actually built.

- `chapter-4.md` — Chapter Four (System Implementation, Testing and Results), written in Markdown.
- `chapter-4.docx` — the same chapter as a Word document, with all figures and tables embedded, ready to copy into (or open alongside) your main project report.
- `figures/` — Screenshots referenced by the chapter, captured directly from the running application (admin portal, student onboarding wizard, print page, dashboard).

## Regenerating chapter-4.docx after editing chapter-4.md

`chapter-4.docx` was generated with `convert.js` in this folder — a small Node script (`marked` to parse the Markdown + `html-to-docx` to produce the `.docx`, inlining each figure as a base64 image) — rather than Pandoc, since Pandoc's Windows installer was too large to download reliably on this connection. If you edit `chapter-4.md` and want to regenerate the Word file:

```
cd docs/final-year-project
npm install
node convert.js chapter-4.md chapter-4.docx
```

Or, if you have Pandoc installed (`pandoc --version`), the simpler one-liner works too:

```
pandoc chapter-4.md -o chapter-4.docx --resource-path=.
```

## Still needed

Figures 4.19–4.21 (the invigilator mobile app screens) are marked as placeholders in the chapter — those need to be real screenshots taken from your phone while using the app (Settings/print-screen on Android, or the screenshot gesture on iOS), since they're captured on a physical device rather than a desktop browser.
