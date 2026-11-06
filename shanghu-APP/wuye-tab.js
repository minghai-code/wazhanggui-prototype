/* ============================================================
   物业管理 · 身份与底部 Tab（商户端 App 原型演示模块）
   对应 PRD：开发PRD/商户端app分册PRD/S08-物业管理（商户端）.md §2
   机制：
     - identity 存 localStorage.wuye_identity_v1，四种取值：
         merchant 纯商户 / property 物业人员 / manager 物业主管 / both 双身份
     - 底部 Tab 顺序恒定：首页 · 订单 · 工作台 · 物业服务 · 物业管理 · 我的
       按身份显示/隐藏，上限 5 位，超限按优先级下沉（订单最先下沉）
   ============================================================ */
var WUYE_ID_KEY = 'wuye_identity_v1';
var WUYE_DB_KEY = 'wuye_db_v2';

var WUYE_ID_LABEL = {
  merchant: '商户',
  property: '物业人员',
  manager: '物业主管',
  both: '双身份（商户 + 物业人员）'
};

function wuyeIdentity() {
  var v = localStorage.getItem(WUYE_ID_KEY);
  if (!v || !WUYE_ID_LABEL[v]) v = 'merchant';
  return v;
}
function wuyeSetIdentity(v) {
  localStorage.setItem(WUYE_ID_KEY, v);
  if (v === 'merchant') { location.href = 'mine.html'; return; }
  location.reload();
}
function wuyeIsStaff() {
  var id = wuyeIdentity();
  return id === 'property' || id === 'manager' || id === 'both';
}
function wuyeIsManager() { return wuyeIdentity() === 'manager'; }
function wuyeIsMerchant() {
  var id = wuyeIdentity();
  return id === 'merchant' || id === 'both';
}
/* 物业页面专用：进到「物业管理」即按物业人员渲染（无记录或原为商户身份都自动切，不回跳，避免死循环） */
function wuyeEnsureStaff() {
  if (!wuyeIsStaff()) {
    localStorage.setItem(WUYE_ID_KEY, 'property');
    return true;
  }
  return false;
}

/* 待办数（报修 / 问题 / 投诉），供 Tab 角标。v1.5：巡检、整改已下线，不再统计 */
function wuyeTodoCount() {
  try {
    var db = JSON.parse(localStorage.getItem(WUYE_DB_KEY) || 'null') || { bx: [], wt: [], ts: [] };
    var mgr = wuyeIsManager();
    var n = 0;
    (db.bx || []).forEach(function (o) {
      if (mgr ? (o.state === '待受理') : (o.state === '已派单' || o.state === '处理中' || o.state === '待受理')) n++;
    });
    (db.wt || []).forEach(function (o) { if (o.state === '待处理') n++; });
    (db.ts || []).forEach(function (o) { if (o.state === '待受理' || o.state === '处理中') n++; });
    /* 服务预约（Y-22）：后台受理派单后进入「已受理」，派给我的且未到场的计入待办 */
    try {
      var bk = (typeof bookingAll === 'function') ? bookingAll() : (JSON.parse(localStorage.getItem('sh_booking_v4') || '[]') || []);
      var me = (typeof wuyeMe === 'function') ? wuyeMe().name : '';
      bk.forEach(function (o) {
        if (o && o.state === '已受理' && !o.arriveAt && (!o.worker || !me || o.worker === me)) n++;
      });
    } catch (e) {}
    return n;
  } catch (e) { return 0; }
}

/* 底部 Tab：顺序恒定，按身份过滤，上限 5 */
function wuyeTabItems() {
  var id = wuyeIdentity();
  var all = [
    { k: 'home', t: '首页', i: 'fa-house', h: 'home.html', pr: 1 },
    { k: 'orders', t: '订单', i: 'fa-clipboard-list', h: 'orders.html', pr: 6 },
    { k: 'wb', t: '工作台', i: 'fa-briefcase', h: 'workbench.html', pr: 5 },
    { k: 'prop', t: '物业服务', i: 'fa-building', h: 'property.html', pr: 2 },
    { k: 'wuye', t: '物业管理', i: 'fa-screwdriver-wrench', h: 'wuye-home.html', pr: 3 },
    { k: 'mine', t: '我的', i: 'fa-user', h: id === 'merchant' ? 'mine.html' : 'wuye-mine.html', pr: 4 }
  ];
  var vis = all.filter(function (x) {
    if (x.k === 'wuye') return id !== 'merchant';
    if (x.k === 'prop') return id !== 'property' && id !== 'manager';
    if (x.k === 'orders' || x.k === 'wb') return id !== 'property' && id !== 'manager';
    return true;
  });
  if (vis.length > 5) {
    var drop = ['orders', 'wb', 'mine', 'wuye', 'prop', 'home'];
    for (var i = 0; i < drop.length && vis.length > 5; i++) {
      var idx = -1;
      for (var j = 0; j < vis.length; j++) if (vis[j].k === drop[i]) idx = j;
      if (idx > -1 && drop[i] === 'orders') vis.splice(idx, 1);
    }
  }
  return vis;
}

/* 商户端既有页面接入：商户身份时保留原静态 Tab，物业身份时隐藏并改渲染 */
function wuyePatchMerchantPage(active) {
  if (!wuyeIsStaff()) return;
  var nodes = document.querySelectorAll('div.fixed');
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    var h = n.style.height || '';
    var html = n.innerHTML || '';
    if (h === '65px' || html.indexOf('134px') > -1) n.style.display = 'none';
  }
  if (!document.getElementById('wuyeTab')) {
    var box = document.createElement('div');
    box.id = 'wuyeTab';
    document.body.appendChild(box);
  }
  renderWuyeTab(active);
}

function renderWuyeTab(active) {
  var box = document.getElementById('wuyeTab');
  if (!box) return;
  var items = wuyeTabItems();
  var todo = wuyeTodoCount();
  var html = '<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100" style="height:65px;z-index:100;width:393px">'
    + '<div class="flex justify-around items-center h-full" style="padding-bottom:10px">';
  items.forEach(function (x) {
    var on = x.k === active;
    var badge = '';
    if (x.k === 'orders' && wuyeIdentity() === 'merchant') badge = '12';
    if (x.k === 'wuye' && todo > 0) badge = String(todo);
    html += '<a href="' + x.h + '" class="flex flex-col items-center gap-0.5 relative" style="color:' + (on ? '#2563EB' : '#9CA3AF') + '">'
      + '<i class="fas ' + x.i + ' text-[18px]"></i>'
      + '<span class="text-[9px]' + (on ? ' font-semibold' : '') + '">' + x.t + '</span>'
      + (badge ? '<span class="absolute top-0 right-1 bg-red-500 text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center" style="min-width:14px;height:14px">' + badge + '</span>' : '')
      + '</a>';
  });
  html += '</div></div>'
    + '<div class="fixed bottom-0 left-0 right-0 flex justify-center" style="z-index:101;width:393px;pointer-events:none">'
    + '<div style="width:134px;height:5px;background:#1A1A2E;border-radius:3px;margin-bottom:3px"></div></div>';
  box.innerHTML = html;
}
