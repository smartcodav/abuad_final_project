# Final Year Project Report Materials

This folder holds write-up material for the FAEAS final year project report, kept alongside the code so the figures stay in sync with what was actually built.

- `chapter-4.md` — Chapter Four (System Implementation, Testing and Results), written in Markdown.
- `figures/` — Screenshots referenced by the chapter, captured directly from the running application (admin portal, student onboarding wizard, print page, dashboard).

## Turning this into a Word document

The quickest path: open `chapter-4.md` in VS Code with a Markdown preview, or paste it into [Pandoc](https://pandoc.org/) to convert directly to `.docx`:

```
pandoc chapter-4.md -o chapter-4.docx --resource-path=.
```

Otherwise, copy the text into your existing project Word document section by section and re-insert each figure from `figures/` at the marked point — the figure numbers in the text (Figure 4.1, 4.2, …) match the file order.

## Still needed

Figures 4.19–4.21 (the invigilator mobile app screens) are marked as placeholders in the chapter — those need to be real screenshots taken from your phone while using the app (Settings/print-screen on Android, or the screenshot gesture on iOS), since they're captured on a physical device rather than a desktop browser.
