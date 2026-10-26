/**
 * check-smoke.mjs —— 原型「存在但无效」检测
 *
 * 为什么需要它：现有五件套（check-js / check-proto / check-menu / check-contract / check-page-prd）
 * 全部是**存在性检查**——"找得到就算有"。它们抓不到下面这类 bug（本项目真实发生）：
 *
 *   ① 数据有字段，渲染不用      → 左侧树有 pl 字段却只渲染两级（检查全绿）
 *   ② 表单有控件，保存不读      → 新增楼栋没有「所属场所」，push 时不写 pl
 *   ③ 函数被调用，分支走不到    → openBuilding 只在 ('new') 被调，编辑分支是死代码
 *   ④ 按钮有反馈，实际没效果    → 「编辑属性」onclick 只有 toast('已保存…')，不写数据
 *
 * 判据：不看"有没有"，看"通不通"。
 *
 * 用法：node tools/check-smoke.mjs [--dir yunying-PC] [--files a.html,b.html] [--quiet]
 * 退出码：有 ERROR 时非 0（供 CI / 收尾自检卡口）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const a = { dir: 'yunying-PC', files: null, quiet: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--dir') a.dir = argv[++i];
    else if (k === '--files') a.files = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (k === '--quiet') a.quiet = true;
  }
  return a;
}

/* ---------- 工具 ---------- */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

function scriptsOf(html) {
  let js = '';
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) js += m[1] + '\n';
  return js;
}

/** 取函数体（大括号配平，跳过字符串） */
function bodyOf(src, startIdx) {
  let i = src.indexOf('{', startIdx);
  if (i < 0) return '';
  let depth = 0;
  let q = null;
  for (let p = i; p < src.length; p++) {
    const c = src[p];
    if (q) {
      if (c === '\\') p++;
      else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') q = c;
    else if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(i + 1, p);
    }
  }
  return src.slice(i + 1);
}

function functionsOf(js) {
  const list = [];
  for (const m of js.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)) {
    list.push({ name: m[1], params: m[2].split(',').map((s) => s.trim()).filter(Boolean), body: bodyOf(js, m.index), at: m.index });
  }
  return list;
}

/* ---------- 规则 ---------- */

/** ① 表单控件闭环：id="f_xxx" 存在，但保存函数里不读它 → ERROR */
function ruleFormFieldNotRead(file, html, js, fns) {
  const out = [];
  // 只认约定前缀（表单字段 f_ / 新增 n_ / 编辑 a_），筛选区用别的命名
  const ids = new Set();
  for (const m of html.matchAll(/<(?:input|select|textarea)\b[^>]*\bid="([fnar]_[A-Za-z0-9_]+)"/g)) ids.add(m[1]);
  if (!ids.size) return out;

  const savers = fns.filter((f) => /^(save|submit|confirm|create|add|update|apply|doSave)/i.test(f.name));
  if (!savers.length) return out;
  const saverSrc = savers.map((f) => f.body).join('\n');

  for (const id of ids) {
    if (!new RegExp(`['"\`]${id}['"\`]`).test(saverSrc)) {
      out.push(`[ERROR] ${file}：表单控件 id="${id}" 从未被保存函数读取（保存时该字段不落库）`);
    }
  }
  return out;
}

/** ② 数据字段闭环：数据对象 key 只在定义处出现，渲染代码从不引用 → WARN */
function ruleFieldNotRendered(file, js) {
  const out = [];
  const IGNORE = new Set([
    'id', 'name', 'code', 'no', 'status', 'type', 'area', 'color', 'initial', 'desc', 'note', 'remark', 'value', 'label'
  ]);
  // 找形如 var xxx=[{ ... }] / var xxx={...} 的数据块
  for (const m of js.matchAll(/(?:var|let|const)\s+([A-Z_][\w$]*|[a-z][\w$]*)\s*=\s*\[([\s\S]{0,4000}?)\];/g)) {
    const varName = m[1];
    const block = m[2];
    const keys = new Set([...block.matchAll(/[{,]\s*([a-zA-Z_$][\w$]*)\s*:/g)].map((x) => x[1]));
    if (!keys.size) continue;
    for (const k of keys) {
      if (IGNORE.has(k) || k.length < 2) continue;
      // 在数据块之外的代码里找 .k 或 ['k'] 或 "k" 的使用
      const outside = js.slice(0, m.index) + js.slice(m.index + m[0].length);
      const used = new RegExp(`\\.${k}\\b|\\[\\s*['"]${k}['"]\\s*\\]`).test(outside);
      if (!used) {
        out.push(`[INFO] ${file}：数据 ${varName} 有字段 "${k}"，静态看渲染代码未引用（可能是动态取值，需人工确认）`);
      }
    }
  }
  return out;
}

/** ③ 分支不可达：函数内有 'new' 分支，但所有调用点实参都是同一个字面量 → WARN */
function ruleUnreachableBranch(file, js, fns) {
  const out = [];
  for (const f of fns) {
    if (f.params.length !== 1) continue;
    const p = f.params[0];
    if (!new RegExp(`if\\s*\\(\\s*${p}\\s*[!=]==?|${p}\\s*[!=]==?`).test(f.body)) continue;
    if (!/['"]new['"]/.test(f.body)) continue;

    const calls = [...js.matchAll(new RegExp(`(?<!function\\s+)\\b${f.name}\\s*\\(([^)]*)\\)`, 'g'))]
      .map((m) => m[1].trim())
      .filter((a) => a !== '');
    if (!calls.length) continue;
    // 只认「纯字面量」实参：'new' / "new"；'  +i+  ' 这类拼接视为变量，跳过（否则动态渲染全是误报）
    const lits = calls.map((c) => (/^'[^'+]*'$|^"[^"+]*"$/.test(c) ? c : null));
    if (lits.some((l) => l === null)) continue; // 有变量调用，视为可达
    const uniq = new Set(lits);
    if (uniq.size === 1) {
      out.push(`[WARN] ${file}：${f.name}() 的 ${p} 分支（含 'new' 判断）永远走不到——所有调用点都传 ${[...uniq][0]}`);
    }
  }
  return out;
}

/** ④ toast 假保存：出现「已保存/已提交」但函数内没有任何数据写操作 → ERROR */
function ruleFakeSave(file, js, fns) {
  const out = [];
  for (const f of fns) {
    const m = f.body.match(/toast\(\s*'[^']*已(保存|提交|新增|修改|更新)/);
    if (!m) continue;
    const writes = /\.(push|splice|pop|shift|unshift)\s*\(|\.length\s*=[^=]|\b[\w$.]+\s*=\s*(?!=)/.test(
      f.body.replace(/^\s*(?:var|let|const)\s+[\w$]+\s*=\s*document[\s\S]*?;/gm, '')
    );
    if (!writes) {
      out.push(`[ERROR] ${file}：${f.name}() 只 toast「已${m[1]}」，函数内没有任何数据写入（假保存）`);
    }
  }
  // onclick 内联写法：onclick="toast('已保存…')"
  for (const m of js.matchAll(/onclick=\\?["']([^"']*toast\(\s*'[^']*已(保存|提交|新增|修改|更新)[^"']*)\\?["']/g)) {
    out.push(`[ERROR] ${file}：内联 onclick 只 toast「已${m[2]}」，无实际保存动作：${m[1].slice(0, 50)}`);
  }
  return out;
}

/* ---------- 主流程 ---------- */
const args = parseArgs(process.argv);
const dir = path.resolve(ROOT, args.dir);
if (!fs.existsSync(dir)) {
  console.log(`[ERROR] 目录不存在：${dir}`);
  process.exit(1);
}

let files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && !f.startsWith('index-'));
if (args.files) files = files.filter((f) => args.files.includes(f));

const problems = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  if (!/<script/i.test(html)) continue;
  const js = stripComments(scriptsOf(html));
  const fns = functionsOf(js);
  problems.push(
    ...ruleFormFieldNotRead(f, html, js, fns),
    ...ruleFieldNotRendered(f, js),
    ...ruleUnreachableBranch(f, js, fns),
    ...ruleFakeSave(f, js, fns)
  );
}

const errs = problems.filter((p) => p.startsWith('[ERROR]'));
const warns = problems.filter((p) => p.startsWith('[WARN]'));
const infos = problems.filter((p) => p.startsWith('[INFO]'));

if (!args.quiet) {
  for (const p of problems) console.log('  ' + p);
  if (problems.length) console.log('');
}
console.log(
  `check-smoke · dir=${args.dir} · 页面=${files.length}\n` +
    `「存在但无效」：ERROR=${errs.length} ｜ WARN=${warns.length} ｜ INFO=${infos.length}`
);
if (errs.length === 0 && warns.length === 0) console.log('结果：OK（无存在但无效项）');
else if (errs.length) console.log('结果：FAIL（ERROR 必须清零：控件没落库 / 假保存 会让演示当场穿帮）');
else console.log('结果：PASS-WITH-WARN（分支不可达，建议核查是否为死代码）');

process.exitCode = errs.length ? 1 : 0;
