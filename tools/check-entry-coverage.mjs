#!/usr/bin/env node
/**
 * 入口覆盖检查：页面里的每个可点跳转目标，是否都有页面说明。
 *
 * 背景：页面说明按「功能族」分篇，开发按「入口」点，两者不等价；
 *       出现「从 A 页点进去，目标页没有说明」时，开发只能猜。
 *
 * 规则：
 *   1. 扫描 mai-APP/*.html 的跳转目标（href 到 .html、location.href 赋值）
 *   2. 目标页在 prd/manifest.json 里登记 → 已覆盖；否则算「入口无说明」
 *   3. 源页自身无说明也单独列出（孤儿页）
 *
 * 用法：node tools/check-entry-coverage.mjs --root .
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const rootArg = (args.find((a) => a.startsWith('--root=')) || '').split('=')[1]
  || (args.includes('--root') ? args[args.indexOf('--root') + 1] : '.');
const root = path.resolve(rootArg);
const appDir = path.join(root, 'mai-APP');
const manifestPath = path.join(appDir, 'prd', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const documented = new Set(Object.keys(manifest.pages || {}));

const files = fs.readdirSync(appDir).filter((f) => f.endsWith('.html') && f !== 'index-app-mai.html');
const IGNORE = new Set(['#', 'javascript:;', '']);

function targetsOf(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="([^"]+?\.html)(?:\?[^"]*)?"/g)) out.add(path.basename(m[1]));
  for (const m of html.matchAll(/location\.href\s*=\s*'([^']+?\.html)/g)) out.add(path.basename(m[1]));
  for (const m of html.matchAll(/window\.location\.href\s*=\s*'([^']+?\.html)/g)) out.add(path.basename(m[1]));
  return [...out].filter((t) => !IGNORE.has(t));
}

let missingTotal = 0;
const rows = [];
const orphanSources = [];

for (const f of files) {
  const html = fs.readFileSync(path.join(appDir, f), 'utf8');
  const tg = targetsOf(html);
  const miss = tg.filter((t) => !documented.has(t) && t !== f && files.includes(t));
  if (!documented.has(f)) orphanSources.push(f);
  if (miss.length) {
    rows.push({ source: f, total: tg.length, missing: miss });
    missingTotal += miss.length;
  }
}

// 反向：被谁引用（用于判断孤儿页）
const inbound = new Map();
for (const f of files) {
  const html = fs.readFileSync(path.join(appDir, f), 'utf8');
  for (const t of targetsOf(html)) {
    if (!inbound.has(t)) inbound.set(t, new Set());
    inbound.get(t).add(f);
  }
}
const orphans = files.filter((f) => !inbound.has(f) && !documented.has(f));

console.log('\n===== 入口覆盖检查 =====');
console.log(`页面总数 ${files.length}　已写说明 ${[...files].filter((f) => documented.has(f)).length}　入口无说明 ${missingTotal}\n`);

rows.sort((a, b) => b.missing.length - a.missing.length);
for (const r of rows.slice(0, 30)) {
  console.log(`[${r.missing.length}/${r.total}] ${r.source}`);
  console.log('    → ' + r.missing.join(', '));
}

if (orphans.length) {
  console.log('\n无人引用且无说明（疑似孤儿页）：');
  console.log('    ' + orphans.join(', '));
}

console.log('\n提示：目标页说明归哪个族见 prd/manifest.json；无说明=开发点进去没有依据。');
process.exit(0);
