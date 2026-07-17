const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const HTMLtoDOCX = require('html-to-docx');

const mdPath = process.argv[2];
const outPath = process.argv[3];
const baseDir = path.dirname(mdPath);

const md = fs.readFileSync(mdPath, 'utf8');
let html = marked.parse(md);

// Inline local images as base64 data URIs so html-to-docx can embed them.
html = html.replace(/<img src="([^"]+)"([^>]*)>/g, (match, src, rest) => {
    if (/^https?:\/\//.test(src)) return match;
    const imgPath = path.join(baseDir, src);
    const ext = path.extname(imgPath).slice(1) || 'png';
    const data = fs.readFileSync(imgPath).toString('base64');
    return `<img src="data:image/${ext};base64,${data}" style="max-width:600px"${rest}>`;
});

const documentHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;

(async () => {
    const buffer = await HTMLtoDOCX(documentHtml, null, {
        table: { row: { cantSplit: true } },
        footer: false,
        pageNumber: false,
    });
    fs.writeFileSync(outPath, buffer);
    console.log('Wrote', outPath, buffer.length, 'bytes');
})().catch((err) => {
    console.error('CONVERSION_FAILED:', err);
    process.exit(1);
});
