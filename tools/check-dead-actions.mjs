#!/usr/bin/env node
/**
 * 死动作扫描：找出「只有占位提示、没有数据源/真实动作」的可点元素
 * 用法：node tools/check-dead-actions.mjs [--root .] [--only mai-APP] [--json]
 *
 * 判定口径（与《原型页面产品逻辑说明撰写标准》一致）：
 *  P1 纯提示：onclick 只调用 toast/alert/grToast/showToast/poToast，且文案含 演示/mock/占位
 *  P2 空链：href="#" / href="javascript:;" 且无实际跳转
 *  P3 只提示：onclick 只有 toast（不含跳转、不含取数），文案虽无"演示"也算占位
 *  P4 空壳按钮：<button> 无 onclick、无 id、无 data-*，且不在 form 内
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const getArg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const root = getArg('--root', '.');
const only = getArg('--only', '');
const asJson = args.includes('--json');
const blockingOnly = args.includes('--blocking');

const SKIP_DIRS = new Set(['node_modules', '_legacy', '_views', 'images', '.git']);
const TOAST_FN = /(?:^|[^A-Za-z0-9_])(toast|alert|grToast|showToast|poToast|gbToast|kbToast|fbToast|m03Toast)\s*\(/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function stripTags(s) { return s.replace(/<[^>]*>/g, '').trim(); }

function scanFile(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const findings = [];

  // 1) 带 onclick 的元素
  const tagRe = /<(button|a|div|span)\b([^>]*?)onclick\s*=\s*("([^"]*)"|'([^']*)')([^>]*)>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const handler = (m[4] ?? m[5] ?? '').trim();
    const attrs = (m[2] || '') + (m[6] || '');
    const labelM = html.slice(tagRe.lastIndex, tagRe.lastIndex + 220).match(/>([\s\S]{0,80}?)</);
    const label = labelM ? stripTags(labelM[1]).slice(0, 40) : '';
    const placeholder = /演示|mock|占位|示例|TODO|待实现/.test(handler) || /演示|占位/.test(label);

    if (/^\s*(return\s+false|;)?\s*$/.test(handler)) {
      findings.push({ level: 'P2', line: lineOf(html, m.index), label, handler, why: '空 onclick' });
      continue;
    }
    const onlyToast = TOAST_FN.test(handler) && !/location|href|open|close|scroll|submit|save|render|fetch|navigator/.test(handler.replace(TOAST_FN, ''));
    if (onlyToast && placeholder) findings.push({ level: 'P1', line: lineOf(html, m.index), label, handler, why: '纯占位提示（含演示字样）' });
    else if (onlyToast) findings.push({ level: 'P3', line: lineOf(html, m.index), label, handler, why: '只提示、无取数/跳转' });

    // href="#" 只有在「handler 里没有任何函数调用」时才算空链（打开弹层/切换状态是真实动作）
    const hasCall = /[A-Za-z0-9_$]\s*\(/.test(handler);
    if (m[1].toLowerCase() === 'a' && /href\s*=\s*["']#["']/.test(attrs) && !hasCall) {
      findings.push({ level: 'P2', line: lineOf(html, m.index), label, handler, why: 'href="#" 且无任何动作' });
    }
  }

  // 2) 空壳 button（排除委托事件：class 被脚本用选择器绑定过）
  const btnRe = /<button\b([^>]*)>/gi;
  while ((m = btnRe.exec(html))) {
    const attrs = m[1] || '';
    if (/onclick|type\s*=\s*["']submit|data-|id\s*=|disabled/.test(attrs)) continue;
    const labelM = html.slice(btnRe.lastIndex, btnRe.lastIndex + 160).match(/>([\s\S]{0,60}?)</);
    const label = labelM ? stripTags(labelM[1]).slice(0, 40) : '';
    // class 是否被脚本委托绑定（querySelectorAll('.x') / getElementsByClassName）
    const clsM = attrs.match(/class\s*=\s*["']([^"']+)["']/);
    const delegated = clsM && clsM[1].split(/\s+/).some(c => c && (html.includes("querySelectorAll('." + c) || html.includes('querySelectorAll(".' + c) || html.includes("getElementsByClassName('" + c) || html.includes('getElementsByClassName("' + c)));
    if (delegated) continue;
    findings.push({ level: 'P4', line: lineOf(html, m.index), label, handler: '', why: '按钮无任何动作绑定（无委托事件）' });
  }

  return { rel, findings };
}

function lineOf(s, idx) { return s.slice(0, idx).split('\n').length; }

const files = walk(path.join(root, only || '.')).sort();
const results = files.map(scanFile).filter(r => r.findings.length);
const total = results.reduce((a, r) => a + r.findings.length, 0);
const byLevel = { P1: 0, P2: 0, P3: 0, P4: 0 };
results.forEach(r => r.findings.forEach(f => byLevel[f.level]++));

if (blockingOnly) {
  const b = results
    .map(r => ({ rel: r.rel, findings: r.findings.filter(f => f.level !== 'P3') }))
    .filter(r => r.findings.length);
  const n = b.reduce((a, r) => a + r.findings.length, 0);
  console.log(`阻塞级死动作　P1 ${byLevel.P1} / P2 ${byLevel.P2} / P4 ${byLevel.P4}　共 ${n} 处（P3 仅提示类 ${byLevel.P3} 处不计入）\n`);
  for (const r of b) {
    console.log(`■ ${r.rel}`);
    for (const f of r.findings) console.log(`  [${f.level}] L${f.line} ${f.why}${f.label ? ' · 「' + f.label + '」' : ''}\n        ${f.handler.slice(0, 120)}`);
  }
} else if (asJson) {
  console.log(JSON.stringify({ total, byLevel, results }, null, 2));
} else {
  console.log(`死动作扫描　文件 ${files.length} 个　命中 ${total} 处　P1 ${byLevel.P1} / P2 ${byLevel.P2} / P3 ${byLevel.P3} / P4 ${byLevel.P4}\n`);
  for (const r of results) {
    console.log(`■ ${r.rel}（${r.findings.length}）`);
    for (const f of r.findings) {
      console.log(`  [${f.level}] L${f.line} ${f.why}${f.label ? ' · 「' + f.label + '」' : ''}`);
      if (f.handler) console.log(`        ${f.handler.slice(0, 110)}`);
    }
  }
}
