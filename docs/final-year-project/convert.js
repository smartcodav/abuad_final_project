const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const HTMLtoDOCX = require('html-to-docx');
const AdmZip = require('adm-zip');

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

/**
 * html-to-docx (as of 1.8.0) emits <w:sectPr> as the FIRST child of <w:body>,
 * but the OOXML WordprocessingML schema requires a body-level sectPr to be the
 * LAST element in the body. Word's strict validator refuses to open the file
 * ("cannot open content") even though it's a well-formed zip/XML otherwise —
 * this repositions it before repackaging.
 */
function fixSectPrPosition(buffer) {
    const zip = new AdmZip(buffer);
    const entry = zip.getEntry('word/document.xml');
    let xml = entry.getData().toString('utf8');

    const match = xml.match(/<w:sectPr>[\s\S]*?<\/w:sectPr>/);
    if (match) {
        const sectPr = match[0];
        xml = xml.replace(sectPr, '').replace('</w:body>', `${sectPr}</w:body>`);
        zip.updateFile('word/document.xml', Buffer.from(xml, 'utf8'));
    }

    return zip.toBuffer();
}

(async () => {
    const rawBuffer = await HTMLtoDOCX(documentHtml, null, {
        table: { row: { cantSplit: true } },
        footer: false,
        pageNumber: false,
    });
    const buffer = fixSectPrPosition(rawBuffer);
    fs.writeFileSync(outPath, buffer);
    console.log('Wrote', outPath, buffer.length, 'bytes');
})().catch((err) => {
    console.error('CONVERSION_FAILED:', err);
    process.exit(1);
});
