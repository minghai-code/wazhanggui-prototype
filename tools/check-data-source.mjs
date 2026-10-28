#!/usr/bin/env node
/**
 * 数据来源闸门（check-data-source）
 *
 * 目的：堵住「端上展示了内容，但没有任何一端能维护」的孤立设计。
 * 规则：每个页面里写死的内容型数据块（大写常量），必须在这一处登记来源：
 *       归属页面 → 数据块 → 来源端 → 后台维护页面 → 待办编号 → 状态
 * 登记文件：mai-APP/prd/data-source.json
 *
 * 用法：node tools/check-data-source.mjs --root .
 * 退出码：0 通过（允许 WARN）；1 有未登记内容型数据（ERROR）
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const rootArg = argv.indexOf('--root');
const ROOT = path.resolve(rootArg >= 0 ? argv[rootArg + 1] : '.');
const APP = path.join(ROOT, 'mai-APP');
const REG = path.join(APP, 'prd', 'data-source.json');

if (!fs.existsSync(APP)) {
  console.error('找不到 ' + APP);
  process.exit(1);
}

// 纯界面常量：样式、标签、流程步骤、城市表等，不需要业务来源
const UI_RE = /(STYLE|_BG$|_LABEL|_BTN$|_TABS?$|FLOW$|_META$|_KEY$|^CITY$|^STATUS$|^ACT$|^STEPS$|BADGE$|^INDS$|ROUTE_META|JUMP_LABEL|JUMP_BTN|SEAT_STYLE|RATE_TAGS|_STYLE$|SHAPE|TYPE_LABEL|SKELETON)/;

const reg = fs.existsSync(REG)
  ? JSON.parse(fs.readFileSync(REG, 'utf8'))
  : { ui: [], items: {} };
const uiAllow = new Set(reg.ui || []);
const items = reg.items || {};

const pages = fs
  .readdirSync(APP)
  .filter((f) => f.endsWith('.html') && !/^(_|index)/.test(f))
  .sort();

const errors = [];
const warns = [];
const seen = [];

for (const page of pages) {
  const html = fs.readFileSync(path.join(APP, page), 'utf8');
  const re = /^[ \t]*(?:var|const|let)[ \t]+([A-Z][A-Z0-9_]{2,})[ \t]*=[ \t]*([{[])/gm;
  let m;
  while ((m = re.exec(html))) {
    const name = m[1];
    const key = page + '::' + name;
    if (uiAllow.has(key) || uiAllow.has(name) || UI_RE.test(name)) continue;
    seen.push(key);
    if (!items[key]) errors.push(key);
  }
}

// 登记项完整性：待办编号必须真实存在于某一端待办文件
const todoFiles = [
  path.join(ROOT, 'shanghu-APP', '移动端原型修改待办.md'),
  path.join(ROOT, 'yunying-PC', '原型修改待办.md'),
  path.join(ROOT, 'harness', 'backlog.md'),
].filter((f) => fs.existsSync(f));
const todoText = todoFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

for (const [key, v] of Object.entries(items)) {
  for (const f of ['kind', 'source', 'status']) {
    if (!v[f]) warns.push(key + ' 缺字段 ' + f);
  }
  if (v.status !== 'built') {
    if (!v.todo) warns.push(key + ' 未完成但没写 todo 编号');
    else if (!todoText.includes(v.todo)) errors.push(key + ' 的待办 ' + v.todo + ' 在待办文件里找不到');
  }
}

// 登记了但原型里已不存在的数据块 → 提示清理
const stale = Object.keys(items).filter((k) => !seen.includes(k));

console.log('=== 数据来源闸门 ===');
console.log('页面 ' + pages.length + '；需登记数据块 ' + seen.length + '；已登记 ' + Object.keys(items).length);
if (stale.length) console.log('提示：登记了但页面已无此常量（可清理）：' + stale.join(', '));
if (warns.length) {
  console.log('\nWARN ' + warns.length);
  warns.forEach((w) => console.log('  ! ' + w));
}
if (errors.length) {
  console.log('\nERROR ' + errors.length + ' —— 下列内容型数据没有任何一端的维护来源：');
  errors.forEach((e) => console.log('  × ' + e));
  console.log('\n处理：在 mai-APP/prd/data-source.json 登记来源，或确认属纯界面常量后加入 ui 白名单。');
  console.log('未闭环项必须同时在对应端待办里写一条，否则不算闭环。');
  process.exit(1);
}
console.log('\nOK：全部内容型数据都有来源登记。');
