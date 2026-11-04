/* ============================================================
   经营品类字典 · 商户端只读副本（原型模拟「接口下发」）
   唯一来源：运营端「04 实体商户管理 → 品类字典」merchant-category.html
   数据文件：yunying-PC/category-dict.js（两份保持一致，改字典请两处同步）
   引用方：shanghu-verify（经营类目）/ profile-edit（资料变更）/ shop-info-edit（店铺展示只读）
   规则：只停用不删除；停用项不进新选择项，历史数据保留并可回显
   ============================================================ */
window.CAT_DICT = [
  { id: 'CT-001', name: '男袜',        group: '袜品',     sort: 1, on: 1, note: '' },
  { id: 'CT-002', name: '女袜',        group: '袜品',     sort: 2, on: 1, note: '' },
  { id: 'CT-003', name: '童袜',        group: '袜品',     sort: 3, on: 1, note: '' },
  { id: 'CT-004', name: '运动袜',      group: '袜品',     sort: 4, on: 1, note: '' },
  { id: 'CT-005', name: '船袜',        group: '袜品',     sort: 5, on: 1, note: '' },
  { id: 'CT-006', name: '保暖袜',      group: '袜品',     sort: 6, on: 1, note: '' },
  { id: 'CT-007', name: '丝袜/打底裤', group: '袜品',     sort: 7, on: 1, note: '' },
  { id: 'CT-008', name: '棉袜',        group: '袜品',     sort: 8, on: 1, note: '' },
  { id: 'CT-009', name: '棉纱',        group: '原料纱线', sort: 1, on: 1, note: '' },
  { id: 'CT-010', name: '氨纶包覆纱',  group: '原料纱线', sort: 2, on: 1, note: '' },
  { id: 'CT-011', name: '袜机',        group: '袜机设备', sort: 1, on: 1, note: '' },
  { id: 'CT-012', name: '缝头机',      group: '袜机设备', sort: 2, on: 0, note: '2026-08 起无商户使用，暂时停用' },
  { id: 'CT-013', name: '包装设计',    group: '设计包装', sort: 1, on: 1, note: '' },
  { id: 'CT-014', name: '其他',        group: '其他',     sort: 1, on: 1, note: '兜底项，不允许停用' }
];

/* 端上通用小工具：启用项（按分组+排序）、按名称取启用状态 */
function catEnabled() {
  return (window.CAT_DICT || []).filter(function (c) { return c.on === 1; })
    .sort(function (a, b) { return a.group === b.group ? a.sort - b.sort : (a.group < b.group ? -1 : 1); });
}
function catNames() { return catEnabled().map(function (c) { return c.name; }); }
function catIsOn(name) {
  var hit = (window.CAT_DICT || []).filter(function (c) { return c.name === name; })[0];
  return !!(hit && hit.on === 1);
}
/* 已选标签渲染：停用/已合并的历史项仍显示，但标灰且不可点 */
function catChipsHtml(selected, opt) {
  opt = opt || {};
  selected = selected || [];
  var on = catNames();
  var all = on.slice();
  selected.forEach(function (s) { if (all.indexOf(s) < 0) all.push(s); });
  return all.map(function (name) {
    var isOn = on.indexOf(name) > -1;
    var isSel = selected.indexOf(name) > -1;
    if (!isOn && !isSel) return '';
    var cls = 'cat-chip' + (isSel ? ' sel' : '') + (isOn ? '' : ' off');
    var onclick = (isOn && !opt.readonly) ? ' onclick="catToggle(this)"' : '';
    var tip = isOn ? '' : ' title="该品类已停用，仅保留历史回显"';
    return '<span class="' + cls + '"' + onclick + tip + '>' + name + (isOn ? '' : '（已停用）') + '</span>';
  }).join('');
}
function catToggle(el) { el.classList.toggle('sel'); }

/* ---------- 所属市场推导（待办 #48 / F05-R2） ----------
   按品类「大类」推导，可多归属：
     袜品     → 袜子市场
     原料纱线 → 原料市场
     混营     → 两个标签都给（2026-11-03 业务拍板：两边都展示）
     袜机设备 / 设计包装 / 其他 → 暂不归属市场（F05 只定义袜子/原料两类市场）
   集合来源是字典，端上不写死品类名 */
var CAT_MARKET = { '袜品': '袜子市场', '原料纱线': '原料市场' };
function catMarketOf(name) {
  var d = (window.CAT_DICT || []).filter(function (c) { return c.name === name; })[0];
  return d ? (CAT_MARKET[d.group] || '') : '';
}
function catMarkets(names) {
  var out = [];
  (names || []).forEach(function (n) {
    var m = catMarketOf(n);
    if (m && out.indexOf(m) < 0) out.push(m);
  });
  return out;
}

/* 品类标签样式（三页共用，避免各页再写一套） */
(function () {
  var s = document.createElement('style');
  s.textContent = '.cat-chip{display:inline-block;font-size:11px;line-height:1;color:#6b7080;background:#fff;border:1px solid #eceef0;border-radius:10px;padding:7px 12px;cursor:pointer;margin:0 4px 4px 0}'
    + '.cat-chip.sel{color:#2563EB;background:#EFF6FF;border-color:#2563EB;font-weight:600}'
    + '.cat-chip.off{color:#B0B6C3;background:#F8FAFC;border-style:dashed;cursor:not-allowed}'
    + '.cat-ro{display:inline-block;font-size:10px;color:#475569;background:#F1F5F9;border-radius:8px;padding:4px 8px;margin:0 4px 4px 0}';
  (document.head || document.documentElement).appendChild(s);
})();
function catSelected(boxId) {
  var box = document.getElementById(boxId);
  if (!box) return [];
  return Array.prototype.map.call(box.querySelectorAll('.cat-chip.sel'), function (e) {
    return e.textContent.replace('（已停用）', '').trim();
  });
}
