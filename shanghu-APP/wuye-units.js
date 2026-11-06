/* ============================================================
   物业服务 ·「一人多档口」共享模块（原型演示，非前后端同步）
   档口字典与 my-shops.html 的 UNITS 同源：02 资源台账 / 05 合同，只读
   规则：各类服务上报默认第一个档口，可下拉切换其他实体；
        记录列表默认展示全部档口的记录，每条标注上报档口，可按需筛选。
   ============================================================ */

var WUYE_UNITS = [
  { code: '1F-A08',      name: '大唐袜业旗舰',           venue: '大唐袜业城',   loc: 'A栋 1F', type: '档口',   area: '50㎡', contract: 'HT2026-0002', status: '营业中' },
  { code: '2F-B12',      name: '大唐袜业旗舰·品牌馆',    venue: '大唐袜业城',   loc: 'B栋 2F', type: '档口',   area: '40㎡', contract: 'HT2025-0088', status: '营业中' },
  { code: 'YLSC-S08',    name: '大唐袜业·原料仓店',      venue: '原料市场',     loc: '沿街店面', type: '店面', area: '80㎡', contract: 'HT2026-0010', status: '休息中' },
  { code: 'XZFW-3F-06',  name: '大唐袜业·办公',          venue: '行政服务中心', loc: '3F',      type: '办公室', area: '45㎡', contract: 'HT2026-0012', status: '营业中' }
];

var WUYE_UNIT_KEY = 'sh_wuye_unit';
var WUYE_ALL = '__ALL__';

function wuyeUnitOf(code) {
  for (var i = 0; i < WUYE_UNITS.length; i++) if (WUYE_UNITS[i].code === code) return WUYE_UNITS[i];
  return null;
}
function wuyeCurCode() {
  try {
    var c = localStorage.getItem(WUYE_UNIT_KEY);
    if (c && wuyeUnitOf(c)) return c;
  } catch (e) {}
  return WUYE_UNITS[0].code;
}
function wuyeSetUnit(code) {
  if (!wuyeUnitOf(code)) return;
  try { localStorage.setItem(WUYE_UNIT_KEY, code); } catch (e) {}
}
function wuyeCur() { return wuyeUnitOf(wuyeCurCode()) || WUYE_UNITS[0]; }
function wuyeLabel(code) {
  var u = wuyeUnitOf(code);
  return u ? (u.code + ' · ' + u.name) : (code || '公共区域');
}
function wuyeMetaHtml(u) {
  return '<span>' + u.venue + ' ' + u.loc + '</span>'
    + '<span>' + u.type + ' · ' + u.area + '</span>'
    + '<span>合同 ' + u.contract + '</span>'
    + '<span>' + u.status + '</span>';
}

/* 各类服务上报表单里的档口选择器：默认首个，下拉可切换 */
function wuyePickerHtml(opt) {
  opt = opt || {};
  var cur = wuyeCur();
  return '<div class="wu-box">'
    + '<div class="wu-box-hd"><b><i class="fas fa-store" style="color:#2563EB"></i> '
    + (opt.title || '申报档口') + ' <span style="color:#EF4444">*</span></b>'
    + '<span>共 ' + WUYE_UNITS.length + ' 处 · 默认首个</span></div>'
    + '<div class="wu-sel-wrap"><i class="fas fa-location-dot"></i>'
    + '<select id="' + (opt.id || 'wuUnitSel') + '" class="wu-sel" onchange="wuyePickerChange(this)">'
    + WUYE_UNITS.map(function (u) {
        return '<option value="' + u.code + '"' + (u.code === cur.code ? ' selected' : '') + '>'
          + u.code + ' · ' + u.name + '（' + u.loc + '）</option>';
      }).join('')
    + '</select><i class="fas fa-chevron-down"></i></div>'
    + '<div class="wu-meta" id="' + (opt.metaId || 'wuUnitMeta') + '">' + wuyeMetaHtml(cur) + '</div>'
    + '<p class="wu-note">下拉可切换到名下其他实体；本次提交按所选档口归属，历史记录仍展示全部档口。</p>'
    + '</div>';
}
function wuyePickerChange(sel) {
  wuyeSetUnit(sel.value);
  var u = wuyeCur();
  var m = document.getElementById('wuUnitMeta');
  if (m) m.innerHTML = wuyeMetaHtml(u);
  wuyeFill();
  if (typeof wuyeOnUnitChange === 'function') wuyeOnUnitChange(u);
}

/* 覆盖各页原有的商户档案只读回显（data-sh="shop / floor / area"） */
function wuyeFill() {
  var u = wuyeCur();
  var map = { shop: u.code, floor: u.venue + ' ' + u.loc, area: u.area };
  if (!document.querySelectorAll) return;
  document.querySelectorAll('[data-sh]').forEach(function (el) {
    var k = el.getAttribute('data-sh');
    if (map[k] != null) el.textContent = map[k];
  });
}

/* 记录列表里的档口标签 */
function wuyeTag(code) {
  var u = wuyeUnitOf(code);
  return '<span class="wu-tag"><i class="fas fa-store"></i>'
    + (code || '公共区域') + (u ? ' · ' + u.name : '') + '</span>';
}

/* 记录列表的档口筛选：默认「全部档口」，与状态 Tab 组合使用 */
function wuyeFilterHtml(opt) {
  opt = opt || {};
  var cur = opt.cur || WUYE_ALL;
  return '<div class="wu-filter">'
    + '<span class="wu-filter-lb"><i class="fas fa-filter"></i> 档口</span>'
    + '<div class="wu-fsel-wrap"><select id="' + (opt.id || 'wuFilterSel') + '" class="wu-filter-sel" onchange="'
    + (opt.onchange || 'wuyeFilterChange') + '(this.value)">'
    + '<option value="' + WUYE_ALL + '"' + (cur === WUYE_ALL ? ' selected' : '') + '>全部档口（' + WUYE_UNITS.length + ' 处）</option>'
    + WUYE_UNITS.map(function (u) {
        return '<option value="' + u.code + '"' + (cur === u.code ? ' selected' : '') + '>'
          + u.code + ' · ' + u.name + '</option>';
      }).join('')
    + '</select><i class="fas fa-chevron-down"></i></div></div>';
}
function wuyeFilterMatch(code, sel) {
  return !sel || sel === WUYE_ALL || code === sel;
}

/* 样式由本模块注入，各页无需改 CSS */
(function () {
  var css = [
    '.wu-box{background:#fff;border:1px solid #E6EDF7;border-radius:14px;padding:11px 12px;margin-bottom:12px}',
    '.wu-box-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px}',
    '.wu-box-hd b{font-size:11px;color:#1F2937;font-weight:700;white-space:nowrap}',
    '.wu-box-hd span{font-size:9px;color:#94A3B8;white-space:nowrap}',
    '.wu-sel-wrap,.wu-fsel-wrap{position:relative;display:flex;align-items:center}',
    '.wu-sel{width:100%;appearance:none;-webkit-appearance:none;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:10px 30px 10px 32px;font-size:12px;font-weight:700;color:#1D4ED8;outline:none;cursor:pointer}',
    '.wu-sel-wrap>i.fa-location-dot{position:absolute;left:11px;color:#2563EB;font-size:11px;pointer-events:none}',
    '.wu-sel-wrap>i.fa-chevron-down{position:absolute;right:12px;color:#2563EB;font-size:10px;pointer-events:none}',
    '.wu-meta{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:8px;font-size:9px;color:#64748B}',
    '.wu-meta span{white-space:nowrap}',
    '.wu-note{font-size:9px;color:#94A3B8;margin-top:7px;line-height:1.5}',
    '.wu-tag{display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:600;color:#1D4ED8;background:#EFF6FF;border:1px solid #DBEAFE;border-radius:6px;padding:2px 6px;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}',
    '.wu-filter{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #E6EDF7;border-radius:12px;padding:7px 10px;margin-bottom:10px}',
    '.wu-filter-lb{font-size:10px;color:#64748B;font-weight:600;white-space:nowrap;display:flex;align-items:center;gap:4px}',
    '.wu-filter-lb i{color:#2563EB;font-size:9px}',
    '.wu-fsel-wrap{flex:1;min-width:0}',
    '.wu-filter-sel{width:100%;appearance:none;-webkit-appearance:none;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:6px 24px 6px 9px;font-size:10px;font-weight:600;color:#334155;outline:none;cursor:pointer}',
    '.wu-fsel-wrap>i.fa-chevron-down{position:absolute;right:9px;color:#94A3B8;font-size:9px;pointer-events:none}'
  ].join('');
  try {
    var s = document.createElement('style');
    s.setAttribute('data-wu', 'units');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();
