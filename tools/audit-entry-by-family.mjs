#!/usr/bin/env node
/**
 * 按功能族统计出链覆盖：每个已写说明的页面 出口数 / 已有说明 / 待写(B) / 疑似A(未写但可能内联)
 * 用法：node tools/audit-entry-by-family.mjs --root .
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const rootArg = (args.find((a) => a.startsWith('--root=')) || '').split('=')[1]
  || (args.includes('--root') ? args[args.indexOf('--root') + 1] : '.');
const root = path.resolve(rootArg);
const appDir = path.join(root, 'mai-APP');
const manifest = JSON.parse(fs.readFileSync(path.join(appDir, 'prd', 'manifest.json'), 'utf8'));
const pages = manifest.pages || {};
const fams = manifest.families || {};

// A 类候选：不以独立页承载的轻量页（广告位 / 外部 / 架构外）
const A_HINT = new Set(['merchant-join.html', 'index-app-mai.html']);
const ARCHIVE = new Set(['market-logistics.html', 'market-machine.html', 'material-warehouse.html', 'services.html']);

const files = new Set(fs.readdirSync(appDir).filter((f) => f.endsWith('.html')));

function targetsOf(html) {
  const s = new Set();
  for (const m of html.matchAll(/href="([^"]+?\.html)(?:\?[^"]*)?"/g)) s.add(path.basename(m[1]));
  for (const m of html.matchAll(/location\.href\s*=\s*'([^']+?\.html)/g)) s.add(path.basename(m[1]));
  for (const m of html.matchAll(/window\.location\.href\s*=\s*'([^']+?\.html)/g)) s.add(path.basename(m[1]));
  return [...s].filter((t) => files.has(t));
}

const famRows = {};
for (const [file, meta] of Object.entries(pages)) {
  const html = fs.readFileSync(path.join(appDir, file), 'utf8');
  const tg = targetsOf(html).filter((t) => t !== file);
  const miss = tg.filter((t) => !pages[t] && !ARCHIVE.has(t));
  const aCand = miss.filter((t) => A_HINT.has(t));
  const bMiss = miss.filter((t) => !A_HINT.has(t));
  const fam = meta.fam;
  famRows[fam] = famRows[fam] || [];
  famRows[fam].push({ file, total: tg.length, covered: tg.length - miss.length, a: aCand.length, b: bMiss.length, bList: bMiss });
}

console.log('\n===== 各族出链覆盖 =====');
for (const [fam, rows] of Object.entries(famRows)) {
  const name = fams[fam]?.name || '';
  const t = rows.reduce((s, r) => s + r.total, 0);
  const c = rows.reduce((s, r) => s + r.covered, 0);
  const b = rows.reduce((s, r) => s + r.b, 0);
  console.log(`\n## ${fam} ${name}｜页 ${rows.length}｜出口 ${t}｜已覆盖 ${c}｜B待写 ${b}`);
  for (const r of rows) {
    if (r.b || r.a) console.log(`  ${r.file}  ${r.covered}/${r.total}  B欠${r.b}${r.bList.length ? ' → ' + r.bList.join(',') : ''}${r.a ? '  A候选' + r.a : ''}`);
  }
}
