#!/usr/bin/env node
/**
 * 契约校验：harness/contract.md ↔ wazhanggui-code 原型文件
 *
 * 校验三件事：
 *   1) 契约里登记的页面文件是否存在（缺失 = ERROR）
 *   2) 契约里"必须出现的状态"是否真的出现在页面源码里（缺失 = ERROR）
 *   3) 契约里"必须出现的字段"是否出现在页面源码里（缺失 = WARN）
 *
 * 用法：
 *   node check-contract.mjs                # 全量（页面 + 状态）
 *   node check-contract.mjs --only=买家端   # 只看某一端（运营端/商户端/买家端）
 *   node check-contract.mjs --fields        # 附带字段校验（字段名多为语义描述，默认关）
 *   node check-contract.mjs --strict        # 字段缺失也判失败（需配合 --fields）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CONTRACT = path.join(REPO_ROOT, 'harness', 'contract.md');
const CODE_ROOT = path.join(REPO_ROOT, 'wazhanggui-code');

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || '';
const strict = args.includes('--strict');
const checkFields = args.includes('--fields') || strict;

const END_DIR = { 运营端: 'yunying-PC', 商户端: 'shanghu-APP', 买家端: 'mai-APP' };
const SKIP_STATE = [/^(—|-|无|仅|不|待定)/, /类（/, /\d+\s*类$/];

const errors = [];
const warns = [];
let rows = 0;

if (!fs.existsSync(CONTRACT)) {
  console.error(`[FATAL] 找不到契约文件：${CONTRACT}`);
  process.exit(2);
}

const lines = fs.readFileSync(CONTRACT, 'utf8').split(/\r?\n/);
let section = '运营端';

/** 解析"页面文件"单元格，支持 "a.html（+ b / c）" 这种写法 */
function parsePages(cell, end) {
  const dir = END_DIR[end] || 'yunying-PC';
  const extra = [];
  let s = cell.replace(/[（(]([^）)]*)[）)]/g, (_, inner) => {
    if (/\.html/i.test(inner) || /\//.test(inner)) extra.push(inner);
    return '';
  });
  const parts = s.split(/[＋+、,，]/).map((t) => t.trim()).filter(Boolean);
  for (const e of extra) parts.push(...e.split(/[＋+、,，/]/));
  return [...new Set(parts)]
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      if (/\.html$/i.test(t)) return t.includes('/') ? t : `${dir}/${t}`;
      // 括号里的裸文件名，继承主文件目录
      const base = parts[0] && parts[0].includes('/') ? parts[0].split('/')[0] : dir;
      return `${base}/${t.replace(/\.html?$/i, '')}.html`;
    });
}

/** 拆状态/字段：只按逗号分号拆，绝不按 / 拆（"改价 N/2" 这类要保留） */
function parseTokens(cell) {
  return cell
    .split(/[,，;；]/)
    .map((t) => t.replace(/[（(][^）)]*[）)]/g, '').trim())
    .filter(Boolean)
    .filter((t) => t.length > 1);
}

for (const line of lines) {
  if (/^##\s+/.test(line)) {
    const h = line.replace(/^##\s+/, '').trim();
    if (h.includes('买家端')) section = '买家端';
    else if (h.includes('商户端')) section = '商户端';
    else section = '运营端';
    continue;
  }
  if (!line.startsWith('|')) continue;
  if (/^\|[\s:|-]+\|$/.test(line)) continue;

  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 5) continue;
  if (cells[0] === '需求' || cells[0].includes('需求编号')) continue;

  const [req, pageCell, stateCell, fieldCell, endCell] = cells;
  const end = endCell.includes('买家端') ? '买家端' : endCell.includes('商户端') ? '商户端' : '运营端';
  if (only && end !== only) continue;

  rows++;
  const pages = parsePages(pageCell, end);
  if (!pages.length) {
    warns.push(`[${end}] ${req} 未解析出页面文件（原值：${pageCell}）`);
    continue;
  }

  let haystack = '';
  for (const p of pages) {
    const abs = path.join(CODE_ROOT, p);
    if (!fs.existsSync(abs)) {
      errors.push(`[${end}] ${req} 页面缺失：${p}`);
      continue;
    }
    const size = fs.statSync(abs).size;
    if (size < 500) errors.push(`[${end}] ${req} 页面疑似空文件：${p}（${size}B）`);
    haystack += fs.readFileSync(abs, 'utf8');
  }

  for (const st of parseTokens(stateCell)) {
    if (SKIP_STATE.some((re) => re.test(st))) continue;
    if (!haystack.includes(st)) errors.push(`[${end}] ${req} 状态缺失：「${st}」不在 ${pages.join(' / ')}`);
  }
  if (!checkFields) continue;
  for (const fd of parseTokens(fieldCell)) {
    if (SKIP_STATE.some((re) => re.test(fd))) continue;
    if (!haystack.includes(fd)) warns.push(`[${end}] ${req} 字段未直接命中：「${fd}」`);
  }
}

const out = [];
out.push('========================================');
out.push(`契约校验（contract.md → 原型，共 ${rows} 条）`);
out.push('========================================');
if (!errors.length && !warns.length) {
  out.push('[OK] 页面、状态、字段全部命中');
} else {
  out.push(`错误 ${errors.length} 项 / 警告 ${warns.length} 项`);
  errors.forEach((e) => out.push(`  ERROR ${e}`));
  warns.forEach((w) => out.push(`  WARN  ${w}`));
}
const text = out.join('\n');
console.log(text);
fs.writeFileSync(path.join(__dirname, '_contract.txt'), text + '\n', 'utf8');

process.exit(errors.length || (strict && warns.length) ? 1 : 0);
