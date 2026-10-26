#!/usr/bin/env node
/* build-prd.mjs —— 页面 PRD：md → prd.html（供页面抽屉 iframe 加载）
 * 用法：node tools/build-prd.mjs            # 全量
 *       node tools/build-prd.mjs --one yunying-PC/prd/02-xxx.md
 * md 是唯一事实来源；.prd.html 是生成物，勿手改。
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i > -1 ? argv[i + 1] : d; };
const ROOT = path.resolve(arg('--root', process.cwd()));
const ONE = arg('--one', '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

const splitRow = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

function md2html(md) {
  const L = md.split(/\r?\n/), out = [];
  let i = 0;

  while (i < L.length) {
    const line = L[i];

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim(), buf = [];
      i++;
      while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]);
      i++;
      out.push(`<pre class="code"><code data-lang="${esc(lang)}">${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\s*\|/.test(line) && i + 1 < L.length && /^\s*\|[\s:|-]+\|\s*$/.test(L[i + 1])) {
      const head = splitRow(line); i += 2;
      const rows = [];
      while (i < L.length && /^\s*\|/.test(L[i])) rows.push(splitRow(L[i++]));
      out.push('<table><thead><tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>'
        + rows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('')
        + '</tbody></table>');
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lv = h[1].length, text = h[2].trim();
      const num = lv === 2 ? (text.match(/^(\d+)\./) || [])[1] : null;
      out.push(`<h${lv}${num != null ? ` id="p${num}"` : ''}>${inline(text)}</h${lv}>`);
      i++; continue;
    }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < L.length && /^>\s?/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line), tag = ordered ? 'ol' : 'ul', items = [];
      while (i < L.length && (/^\s*[-*]\s+/.test(L[i]) || /^\s*\d+\.\s+/.test(L[i]))) {
        items.push(`<li>${inline(L[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (!line.trim()) { i++; continue; }

    const buf = [];
    while (i < L.length && L[i].trim()
      && !/^#{1,4}\s/.test(L[i]) && !/^```/.test(L[i]) && !/^\s*\|/.test(L[i])
      && !/^\s*[-*]\s+/.test(L[i]) && !/^\s*\d+\.\s+/.test(L[i]) && !/^>\s?/.test(L[i])) {
      buf.push(L[i++]);
    }
    /* 兜底：孤立行（如没有表头的 | 行）不会进上面的 while，必须自己消费掉，
       否则 i 不递增 → 死循环 → out 无限增长 → RangeError: Invalid array length */
    if (!buf.length) { out.push(`<p>${inline(line)}</p>`); i++; continue; }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

const CSS = `
:root{--fg:#1F2430;--muted:#64748B;--line:#E9EDF3}
*{box-sizing:border-box}
body{margin:0;padding:26px 32px 90px;background:#fff;color:var(--fg);
 font:14px/1.75 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif}
h1{font-size:20px;margin:0 0 6px}
h2{font-size:17px;margin:34px 0 12px;padding-top:12px;border-top:1px solid var(--line)}
h3{font-size:15px;margin:22px 0 10px}
h4{font-size:14px;margin:18px 0 8px;color:#334155}
p{margin:8px 0}
table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:12.5px}
th,td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}
th{background:#F8FAFC;font-weight:700}
tr:nth-child(even) td{background:#FCFDFE}
code{background:#F1F5F9;padding:1px 5px;border-radius:4px;font-size:12px;
 font-family:ui-monospace,Menlo,Consolas,monospace;color:#B91C1C}
pre.code{background:#0F172A;color:#E2E8F0;padding:14px 16px;border-radius:10px;overflow:auto;font-size:12px}
pre.code code{background:none;color:inherit;padding:0}
blockquote{margin:10px 0;padding:10px 14px;background:#EFF6FF;border-left:3px solid #60A5FA;
 border-radius:0 8px 8px 0;color:#334155;font-size:13px}
ul,ol{margin:8px 0;padding-left:22px}
li{margin:3px 0}
hr{border:0;border-top:1px dashed var(--line);margin:22px 0}
a{color:#2563EB;text-decoration:none}
.meta{font-size:12px;color:var(--muted);margin:0 0 20px}
.vtitle{font-size:18px;font-weight:800;margin:0 0 4px}
details.fam{margin:12px 0 20px;border:1px solid var(--line);border-radius:10px;background:#F8FAFC;padding:0 14px}
details.fam summary{cursor:pointer;padding:10px 0;font-size:13px;font-weight:700;color:#334155}
details.fam[open]{padding-bottom:10px}
.vnav{display:flex;justify-content:space-between;margin-top:34px;padding-top:14px;border-top:1px dashed var(--line);font-size:13px}
`;

const render = (mdFile, md) => {
  const rel = path.relative(ROOT, mdFile).replace(/\\/g, '/');
  const title = (md.match(/^#\s+(.*)$/m) || [])[1] || path.basename(mdFile, '.md');
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · 页面 PRD</title><style>${CSS}</style></head><body>
<div class="meta">由 <code>${esc(rel)}</code> 生成，勿手改；改文档请改 md 后重跑 build-prd。</div>
${md2html(md)}
</body></html>`;
};

/* 递归收集 prd/ 下所有模块 md（支持 prd/02-模块/01-页面.md 两级） */
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md') && !/^README/i.test(e.name)) out.push(p);
  }
  return out;
}

const targets = [];
if (ONE) targets.push(path.resolve(ONE));
else {
  for (const d of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const prd = path.join(ROOT, d.name, 'prd');
    if (fs.existsSync(prd)) walk(prd, targets);
  }
}

if (!targets.length) { console.error('未找到 md（--root 是否指向代码根目录？）'); process.exit(1); }

/* ---------- 移动端功能族：按 `## N. 页面名 `file.html`` 切出单页视图 ----------
 * 源文档一功能族一篇；抽屉只加载本页视图（_views/族-pN.prd.html）。
 * 视图 = 页头 + 可折叠的 §0 族通用说明 + 本页 10 节 + 上/下一页。
 */
function writeViews(mdFile, md) {
  const L = md.split(/\r?\n/);
  const heads = [];
  L.forEach((line, idx) => {
    const m = line.match(/^##\s+(\d+)\.\s+(.+?)\s*`([^`]+\.html)`\s*$/);
    if (m) heads.push({ idx, num: m[1], title: m[2].trim(), file: m[3] });
  });
  if (!heads.length) return 0;

  const prdDir = path.dirname(mdFile);
  const outDir = path.join(prdDir, '_views');
  fs.mkdirSync(outDir, { recursive: true });

  const base = path.basename(mdFile, '.md');
  const h1 = (md.match(/^#\s+(.*)$/m) || [])[1] || base;
  const zeroMd = L.slice(0, heads[0].idx).join('\n').replace(/^#\s+.*$/m, '');
  const zeroHtml = md2html(zeroMd);

  const appIdx = L.findIndex((l) => /^##\s+附录/.test(l));

  let k = 0;
  heads.forEach((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].idx : (appIdx > h.idx ? appIdx : L.length);
    const body = L.slice(h.idx, end).join('\n');
    const prev = heads[i - 1], next = heads[i + 1];
    const nav = '<div class="vnav">'
      + (prev ? `<a href="${base}-p${prev.num}.prd.html">&larr; ${esc(prev.title)}</a>` : '<span></span>')
      + (next ? `<a href="${base}-p${next.num}.prd.html">${esc(next.title)} &rarr;</a>` : '<span></span>')
      + '</div>';

    const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(h.title)} · 页面说明</title><style>${CSS}</style></head><body>
<div class="meta">由 <code>${esc(path.relative(ROOT, mdFile).replace(/\\/g, '/'))}</code> 的 §${h.num} 生成，勿手改；改文档请改 md 后重跑 build-prd --views。</div>
<div class="vtitle">${esc(h1)} · ${esc(h.title)} <code>${esc(h.file)}</code></div>
<details class="fam"><summary>所属功能族通用说明（§0）</summary>${zeroHtml}</details>
${md2html(body)}
${nav}
</body></html>`;
    fs.writeFileSync(path.join(outDir, `${base}-p${h.num}.prd.html`), html, 'utf8');
    k++;
  });
  return k;
}

const VIEWS = argv.includes('--views');
let n = 0, v = 0;
for (const mdFile of targets) {
  if (!fs.existsSync(mdFile)) { console.error('不存在：' + mdFile); continue; }
  const md = fs.readFileSync(mdFile, 'utf8');
  const outFile = mdFile.replace(/\.md$/, '.prd.html');
  fs.writeFileSync(outFile, render(mdFile, md), 'utf8');
  console.log('OK  ' + path.relative(ROOT, outFile).replace(/\\/g, '/'));
  n++;
  if (VIEWS) {
    const c = writeViews(mdFile, md);
    if (c) {
      v += c;
      console.log('    views  ' + c + ' 个 → ' + path.relative(ROOT, path.join(path.dirname(mdFile), '_views')).replace(/\\/g, '/'));
    }
  }
}
console.log(`\n生成完成：${n} 个 prd.html${VIEWS ? `，${v} 个单页视图` : ''}`);
