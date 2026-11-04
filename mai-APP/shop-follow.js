/* 关注店铺（买家端共用关系）：video.html 与 favorites.html 读写同一份数据
 * 正式实现：关注关系落用户表，店铺资料取店铺主档（运营端 10 商城运营 · 店铺管理）
 * 本文件只做原型状态，不承载任何页面说明内容 */
window.FOLLOW_SHOPS = (function () {
  var KEY = 'sh_follow_shops';
  var DEFAULT = ['袜语工坊', '冰丝世家', '运动达人袜业'];

  /* 店铺展示资料（mock，正式取店铺主档） */
  var REG = {
    '袜语工坊': { cat: '主营:纯棉袜·商务袜', rating: '4.9', fans: '12.6万', goods: 168, grad: 'linear-gradient(135deg,#FF6B35,#FF4D2D)', icon: 'fa-socks' },
    '冰丝世家': { cat: '主营:冰丝袜·夏季凉感袜', rating: '4.8', fans: '8.9万', goods: 96, grad: 'linear-gradient(135deg,#38BDF8,#3B82F6)', icon: 'fa-snowflake' },
    '运动达人袜业': { cat: '主营:运动袜·压缩袜', rating: '4.9', fans: '15.2万', goods: 203, grad: 'linear-gradient(135deg,#34D399,#10B981)', icon: 'fa-person-running' },
    '大唐自有品牌旗舰店': { cat: '主营:商务袜·女士袜', rating: '4.9', fans: '23.8万', goods: 312, grad: 'linear-gradient(135deg,#FF6B35,#FF2D78)', icon: 'fa-socks' },
    '萌宝袜业工厂': { cat: '主营:婴童袜·A类标准', rating: '4.8', fans: '6.2万', goods: 88, grad: 'linear-gradient(135deg,#FFB020,#FF8A4C)', icon: 'fa-child' },
    '动力袜业工厂': { cat: '主营:运动袜·毛巾底', rating: '4.7', fans: '9.4万', goods: 121, grad: 'linear-gradient(135deg,#38BDF8,#2563EB)', icon: 'fa-person-running' },
    '锦绣袜业工坊': { cat: '主营:提花袜·女袜定制', rating: '4.8', fans: '4.6万', goods: 74, grad: 'linear-gradient(135deg,#A78BFA,#7C3AED)', icon: 'fa-palette' },
    '恒源棉纱直营': { cat: '主营:精梳棉纱·氨纶包覆纱', rating: '4.9', fans: '2.8万', goods: 56, grad: 'linear-gradient(135deg,#FBBF24,#F59E0B)', icon: 'fa-spool' },
    '宏达包装辅料': { cat: '主营:包装物料·辅料橡筋', rating: '4.6', fans: '1.9万', goods: 43, grad: 'linear-gradient(135deg,#2DD4BF,#0D9488)', icon: 'fa-box' },
    '诸暨织造代工': { cat: '主营:袜机设备·代工', rating: '4.7', fans: '1.2万', goods: 27, grad: 'linear-gradient(135deg,#818CF8,#4F46E5)', icon: 'fa-gears' },
    '大唐袜业城官方': { cat: '官方:线下市场·产业服务', rating: '5.0', fans: '31.5万', goods: 0, grad: 'linear-gradient(135deg,#34D399,#059669)', icon: 'fa-building' },
    '袜掌柜官方': { cat: '官方:平台内容', rating: '5.0', fans: '48.2万', goods: 0, grad: 'linear-gradient(135deg,#38BDF8,#0EA5E9)', icon: 'fa-circle-check' }
  };

  function read() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (a && a.length) return a;
    } catch (e) {}
    return DEFAULT.slice();
  }
  var list = read();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  return {
    list: function () { return list.slice(); },
    has: function (n) { return list.indexOf(n) >= 0; },
    count: function () { return list.length; },
    add: function (n) {
      if (list.indexOf(n) < 0) { list.push(n); save(); }
    },
    remove: function (n) {
      list = list.filter(function (x) { return x !== n; });
      save();
    },
    info: function (n) {
      return REG[n] || { cat: '主营：待完善', rating: '—', fans: '—', goods: '—', grad: 'linear-gradient(135deg,#94A3B8,#64748B)', icon: 'fa-store' };
    }
  };
})();
