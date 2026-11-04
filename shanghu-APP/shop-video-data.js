/* ============================================================
   商户端 · 视频看货 数据层（原型 mock，localStorage）
   口径来源：运营端 mall-video.html v1.2 / prd/10b-商城运营/07-视频看货管理.md
   关键裁决：
     V-1 视频品类 = 关联商品的品类（派生只读，App 不提供选择）
     V-2 一条视频 ≤1 个商品；商户上传**必挂**本店在售线上商品
     V-3 与后台同一份数据；审核/精选只在运营端
     归属 = **线上店铺**（与线下档口/铺位无关）
   ============================================================ */
var VID_KEY = 'sh_video_v1';

/* 线上店铺（电商模块；单店模式） */
var VID_SHOP = { name: '大唐袜业旗舰', state: '营业中', open: true };

/* 本店在售线上商品（对应 products.html「出售中」） */
var VID_GOODS = [
  { id: 'G-1001', name: '精梳棉商务男袜 透气防臭 10双装', price: 10.00, unit: '双', stock: 1200, cat: '男袜', state: '在售' },
  { id: 'G-1002', name: '女士碎花短袜 纯棉透气 5双装', price: 8.80, unit: '双', stock: 800, cat: '女袜', state: '在售' },
  { id: 'G-1003', name: '运动压缩跑步袜 减震防滑', price: 12.50, unit: '双', stock: 300, cat: '运动袜', state: '在售' }
];

/* 状态（与后台一致：草稿 / 待审核 / 已上架 / 已下架 / 被驳回）
   goodInvalid 与状态正交，只作用于「已上架」 */
var VID_ST = {
  '草稿': ['#F1F5F9', '#64748B'],
  '待审核': ['#EFF6FF', '#2563EB'],
  '已上架': ['#ECFDF5', '#059669'],
  '被驳回': ['#FFF7ED', '#EA580C'],
  '已下架': ['#F3F4F6', '#6B7280']
};

function vidSeed() {
  return [
    {
      id: 'V1', title: '秋季新款羊毛袜实拍', desc: '加厚美羊毛，工厂直发，可一件代发',
      cover: 'a', dur: '0:42', goods: 'G-1001', goodInvalid: false,
      state: '已上架', at: '2026-11-02', plays: 3240, likes: 128, favs: 46, clicks: 89,
      rejectWhy: '', offWhy: '', submitAt: '2026-11-01 16:20', auditAt: '2026-11-02 09:10'
    },
    {
      id: 'V2', title: '车间流水线 48 秒实拍', desc: '从织造到定型全流程，看得见的生产',
      cover: 'b', dur: '0:48', goods: 'G-1003', goodInvalid: true,
      state: '已上架', at: '2026-10-28', plays: 8920, likes: 356, favs: 214, clicks: 168,
      rejectWhy: '', offWhy: '', submitAt: '2026-10-27 10:05', auditAt: '2026-10-28 08:40'
    },
    {
      id: 'V3', title: '打包发货现场', desc: '当天下单当天打包，江浙沪次日达',
      cover: 'c', dur: '0:35', goods: 'G-1002', goodInvalid: false,
      state: '待审核', at: '2026-11-03', plays: 0, likes: 0, favs: 0, clicks: 0,
      rejectWhy: '', offWhy: '', submitAt: '2026-11-03 15:40', auditAt: ''
    },
    {
      id: 'V4', title: '新款花型试拍（第一版）', desc: '新花型打样效果',
      cover: 'd', dur: '0:22', goods: 'G-1001', goodInvalid: false,
      state: '被驳回', at: '2026-11-01', plays: 0, likes: 0, favs: 0, clicks: 0,
      rejectWhy: '画面偏暗、抖动明显，看不清花型细节；请补光后重拍，建议横屏改竖屏', offWhy: '',
      submitAt: '2026-11-01 11:20', auditAt: '2026-11-01 17:05'
    },
    {
      id: 'V5', title: '店铺开业实拍（草稿）', desc: '',
      cover: 'e', dur: '0:18', goods: '', goodInvalid: false,
      state: '草稿', at: '2026-10-30', plays: 0, likes: 0, favs: 0, clicks: 0,
      rejectWhy: '', offWhy: '', submitAt: '', auditAt: ''
    },
    {
      id: 'V6', title: '旧款清仓实拍', desc: '库存尾货，价格可谈',
      cover: 'f', dur: '0:30', goods: 'G-1002', goodInvalid: false,
      state: '已下架', at: '2026-10-20', plays: 1560, likes: 62, favs: 18, clicks: 41,
      rejectWhy: '', offWhy: '商户自行下架（换季清仓结束）', submitAt: '2026-10-19 14:00', auditAt: '2026-10-20 09:30'
    }
  ];
}

function vidAll() {
  try {
    var s = localStorage.getItem(VID_KEY);
    if (s) return JSON.parse(s);
  } catch (e) { }
  var d = vidSeed();
  localStorage.setItem(VID_KEY, JSON.stringify(d));
  return d;
}
function vidSave(list) { localStorage.setItem(VID_KEY, JSON.stringify(list)); }
function vidGet(id) { return vidAll().filter(function (v) { return v.id === id; })[0] || null; }
function vidUpsert(v) {
  var list = vidAll();
  var i = -1;
  list.forEach(function (x, k) { if (x.id === v.id) i = k; });
  if (i > -1) list[i] = v; else list.unshift(v);
  vidSave(list);
}
function vidGoods(gid) { return VID_GOODS.filter(function (g) { return g.id === gid; })[0] || null; }
function vidCat(v) { var g = vidGoods(v.goods); return g ? g.cat : '—'; }
function vidStateStyle(s) { var c = VID_ST[s] || VID_ST['草稿']; return 'background:' + c[0] + ';color:' + c[1]; }
function vidCount(list, st) {
  if (st === '全部') return list.length;
  return list.filter(function (v) { return v.state === st; }).length;
}
/* 封面占位（原型用渐变块，避免依赖外部图片） */
var VID_COVER = {
  a: ['linear-gradient(150deg,#FDE68A,#F59E0B)', 'fa-socks'],
  b: ['linear-gradient(150deg,#93C5FD,#2563EB)', 'fa-industry'],
  c: ['linear-gradient(150deg,#6EE7B7,#059669)', 'fa-box-open'],
  d: ['linear-gradient(150deg,#C4B5FD,#7C3AED)', 'fa-palette'],
  e: ['linear-gradient(150deg,#FBCFE8,#DB2777)', 'fa-store'],
  f: ['linear-gradient(150deg,#CBD5E1,#64748B)', 'fa-tag']
};
function vidCover(key) { return VID_COVER[key] || VID_COVER.a; }
function vidNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace('.0', '') + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}
function vidNow() {
  var d = new Date(); function p(n) { return n < 10 ? '0' + n : '' + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function vidToday() { return vidNow().slice(0, 10); }
