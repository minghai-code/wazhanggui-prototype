#!/usr/bin/env node
/* check-page-prd.mjs —— 页面 PRD 与原型的一致性检查
 * 用法：node tools/check-page-prd.mjs [--root .] [--stale-days 1]
 * 输出：[ERROR] 断链 / [WARN] 漏登·疑似失效 / [INFO] 未挂载
 * 退出码：有 ERROR → 1
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i > -1 ? argv[i + 1] : d; };
const ROOT = path.resolve(arg('--root', '.'));
const STALE = Number(arg('--stale-days', '1'));
const DAY = 86400000;

const SKIP_DIR = new Set(['node_modules', '.git', 'shared', 'tools', 'prd', '_legacy', '.codebuddy']);

/* 公共脚本（说明挂载器 / 操作守卫）里的通用文案也算文案来源，否则会被误判为"页面里找不到" */
const SHARED_TEXT = (() => {
  const dir = path.join(ROOT, 'shared');
  if (!fs.existsSync(dir)) return '';
  return fs.readdirSync(dir).filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
})();
const SKIP_HTML = /^(index|developing|login)/i;

let E = 0, W = 0, I = 0;
const out = [];
const err = (m) => { E++; out.push('[ERROR] ' + m); };
const warn = (m) => { W++; out.push('[WARN]  ' + m); };
const info = (m) => { I++; out.push('[INFO]  ' + m); };

if (!fs.existsSync(ROOT)) { console.error('root 不存在：' + ROOT); process.exit(1); }

/* 递归收集 prd/ 下所有模块 md（支持 prd/02-模块/01-页面.md 两级） */
function walkMd(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(p, out);
    else if (e.name.endsWith('.md') && !/^README/i.test(e.name)) out.push(p);
  }
  return out;
}

const ends = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !SKIP_DIR.has(d.name))
  .map((d) => d.name)
  .filter((name) => {
    const dir = path.join(ROOT, name);
    if (fs.existsSync(path.join(dir, 'prd'))) return true;
    return fs.readdirSync(dir).some((f) => f.endsWith('.html'));
  });

if (!ends.length) { console.error('未发现端目录（应形如 <root>/yunying-PC/prd/）'); process.exit(1); }

for (const end of ends) {
  const endDir = path.join(ROOT, end);
  const prdDir = path.join(endDir, 'prd');
  const htmls = fs.readdirSync(endDir).filter((f) => f.endsWith('.html') && !SKIP_HTML.test(f));

  if (!fs.existsSync(prdDir)) {
    if (htmls.length) info(`${end}：尚未建立 prd/ 目录（${htmls.length} 个页面待补）`);
    continue;
  }

  const mds = walkMd(prdDir, []);
  if (!mds.length) { warn(`${end}：prd/ 下没有模块 md`); continue; }

  const cited = new Map();

  for (const mdPath of mds) {
    const md = path.relative(prdDir, mdPath).replace(/\\/g, '/');
    const mdTime = fs.statSync(mdPath).mtimeMs;
    const text = fs.readFileSync(mdPath, 'utf8');
    const refs = new Set();

    for (const m of text.matchAll(/`([^`\s]+?\.html)(?:[?#][^`]*)?`/g)) {
      const f = m[1].replace(/^\.\//, '');
      if (/^https?:/i.test(f) || f.endsWith('.prd.html')) continue;
      /* 该引用所在行若标注「未建」，属"故意声明页面不存在"，不参与断链核对 */
      const ls = text.lastIndexOf('\n', m.index) + 1;
      const le = text.indexOf('\n', m.index);
      const line = text.slice(ls, le === -1 ? text.length : le);
      if (/未建/.test(line)) continue;
      refs.add(f);
    }
    if (!refs.size) warn(`${end}/prd/${md}：未引用任何页面文件（缺 §0.3 端间落点表？）`);

    for (const f of refs) {
      // 依次找：本端相对路径 → 代码根相对路径 → 其他端同名文件（跨端引用合法）
      let cand = [path.join(endDir, f), path.join(ROOT, f)].find((p) => fs.existsSync(p));
      if (!cand) {
        for (const other of ends) {
          const p = path.join(ROOT, other, path.basename(f));
          if (fs.existsSync(p)) { cand = p; break; }
        }
      }
      if (!cand) { err(`${end}/prd/${md} → 引用的页面不存在：${f}`); continue; }
      cited.set(path.basename(cand), { md, mtime: mdTime });
    }
  }

  // 已覆盖模块前缀（如 resource-*）内未登记的，算真漏登；其余模块尚未开写，降为 INFO
  const covered = new Set([...cited.keys()].map((h) => h.split('-')[0]));
  for (const h of htmls) {
    if (cited.has(h)) continue;
    if (covered.has(h.split('-')[0])) warn(`${end}/${h}：同模块其他页面已登记，此页漏登`);
    else info(`${end}/${h}：模块尚无页面 PRD`);
  }

  for (const h of htmls) {
    const p = path.join(endDir, h);
    const text = fs.readFileSync(p, 'utf8');
    if (!/page-prd\.js/.test(text)) info(`${end}/${h}：未引入 page-prd.js（页面上没有说明按钮）`);

    const c = cited.get(h);
    if (c && fs.statSync(p).mtimeMs - c.mtime > STALE * DAY) {
      warn(`${end}/${h}：页面修改时间晚于 ${c.md}（${new Date(c.mtime).toISOString().slice(0, 10)}），文档可能未同步`);
    }
  }
}

/* ========== 数字断言核对（防脑补：统计卡数 / 表格列数） ==========
 * 规则：文档里凡是"统计卡（N）""（N 列）"这类数字断言，必须与页面实际一致。
 * 映射来自 shared/page-prd.js，它同时是"页面 ↔ 文档"的唯一权威。 */
const LOADER = path.join(ROOT, 'shared', 'page-prd.js');
const HTML2MD = {};
if (fs.existsSync(LOADER)) {
  const src = fs.readFileSync(LOADER, 'utf8');
  for (const m of src.matchAll(/'([A-Za-z0-9_\-/]+\.html)'\s*:\s*\[\s*'([^']+)'/g)) {
    HTML2MD[m[1]] = m[2];
  }
}

const uniq = (a) => [...new Set(a)].sort((x, y) => x - y);

for (const [key, mdKey] of Object.entries(HTML2MD)) {
  const htmlPath = path.join(ROOT, key);
  const endName = key.split('/')[0];
  const mdPath = path.join(ROOT, endName, 'prd', mdKey + '.md');
  if (!fs.existsSync(htmlPath)) { err(`映射表里的页面不存在：${key}`); continue; }
  if (!fs.existsSync(mdPath)) { err(`${key} 映射的文档不存在：prd/${mdKey}.md`); continue; }

  const H = fs.readFileSync(htmlPath, 'utf8');
  const M = fs.readFileSync(mdPath, 'utf8');

  /* 统计卡 */
  const hStat = (H.match(/class="stat-card/g) || []).length;
  const mStat = uniq([...M.matchAll(/统计卡（(\d+)/g)].map((x) => +x[1]));
  if (hStat > 0 && !mStat.length) {
    err(`${key}：页面有 ${hStat} 个统计卡，文档没写（漏写统计卡）`);
  } else if (hStat > 0 && mStat.some((n) => n !== hStat)) {
    err(`${key}：统计卡数量不符 —— 页面 ${hStat} 个，文档写 ${mStat.join('/')} 个`);
  } else if (hStat === 0 && mStat.length) {
    err(`${key}：文档写了 ${mStat[0]} 个统计卡，页面没有`);
  }

  /* 表格列数不做集合比对：文档会在附录里引用其他页面的列数，误报率高。
     列的正确性由「字段规格表逐列列出」保证，不靠数字断言。 */

  /* Tab 数 */
  const hTab = (H.match(/class="tab["\s]/g) || []).length;
  const mTab = /Tab 条[^\n]*/.exec(M);
  if (hTab >= 2 && !mTab) {
    warn(`${key}：页面有 ${hTab} 个 Tab，文档没有「Tab 条」描述`);
  }
}

/* ========== 提示文案核对（防语义脑补） ==========
 * 文档里表格的「提示文案」列（校验失败提示 / 异常与边界），必须是页面源码里真实存在的文案。
 * 允许占位符（含 { 的整条跳过，因为源码里是拼接的）。
 * 只比对前 12 个字，容忍动态拼接与细微标点差异。 */
/* 只做字符归一，不能去 HTML 标签：JS 里的 a<b / x>0 会被 <[^>]+> 跨语句吞掉 */
const normText = (s) => s.replace(/[「」『』“”"'`*\s]/g, '');

function copyCells(md) {
  const out = [];
  const lines = md.split(/\r?\n/);
  let col = -1;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!/^\s*\|/.test(L)) { col = -1; continue; }
    /* 每张表独立判断：当前行是表头（下一行是 |---|）时重新定位列 */
    if (i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = L.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((s) => s.trim());
      const k = head.findIndex((c) => /提示文案/.test(c));
      col = k;      // -1 = 该表没有提示文案列，整表跳过
      i++;          // 跳过分隔行
      continue;
    }
    if (col === -1) continue;
    const cells = L.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((s) => s.trim());
    const v = cells[col];
    /* 状态列（表内任一含 ⬜ / ➖ / 待实现 / 不适用的单元格）为未实现，跳过核对 */
    if (cells.some((c) => /⬜|➖|待实现|不适用/.test(c))) continue;
    if (v && v !== '—' && v !== '-') out.push(v);
  }
  return out;
}

for (const [key, mdKey] of Object.entries(HTML2MD)) {
  const htmlPath = path.join(ROOT, key);
  const endName = key.split('/')[0];
  const mdPath = path.join(ROOT, endName, 'prd', mdKey + '.md');
  if (!fs.existsSync(htmlPath) || !fs.existsSync(mdPath)) continue;

  const H = normText(fs.readFileSync(htmlPath, 'utf8'));
  const M = fs.readFileSync(mdPath, 'utf8');
  // 只核对本页章节：§0 是模块通用说明，里面的表可能指向其他页面的文案
  const MBody = M.replace(/^## 0\.[\s\S]*?(?=^## 1\.)/m, '');
  const copies = copyCells(MBody);

  let bad = 0;
  for (const raw of copies) {
    if (raw.includes('待实现') || raw.includes('不适用')) continue;  // 待实现 / 不适用 不参与核对
    let txt = normText(raw);
    txt = txt.replace(/^.*?】/, '').replace(/^(提示|拦截|Toast)[:：]?/, '');
    if (!txt || txt.length < 4) continue;
    if (/[{}]|\+|…|\.\.\./.test(txt)) continue;  // 含占位符 / 拼接 / 省略号（摘要），跳过
    /* 文案常写成「标题 / 说明」，两段在源码里是分开的参数 → 拆开逐段核对 */
    const segs = txt.split('/').map((s) => s.trim()).filter((s) => s.length >= 4);
    for (const seg of (segs.length ? segs : [txt])) {
      const probe = seg.slice(0, 10);
      if (!H.includes(probe) && !SHARED_TEXT.includes(probe)) {
        warn(`${key}：提示文案在页面里找不到 —— 「${probe}」`);
        bad++;
        break;
      }
    }
  }
  if (bad) info(`${key}：共 ${bad} 条文案未在源码命中（可能是动态拼接，请人工确认）`);
}

out.forEach((l) => console.log(l));
console.log('\n' + '-'.repeat(56));
console.log(`页面 PRD 检查　ERROR=${E}　WARN=${W}　INFO=${I}`);
if (E) console.log('存在 ERROR，交付前必须清零。');
process.exit(E ? 1 : 0);
