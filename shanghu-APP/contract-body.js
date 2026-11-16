/* ============================================================
   商户端「合同正文」只读层（唯一来源 = 运营端 contract-tpl.js）
   ------------------------------------------------------------
   为什么单独一个文件：合同正文必须与运营端模板逐字一致，
   两端各存一份就会出现「后台改了模板、商户端还是老文本」的双源问题。
   本文件只做两件事：① 把台账字段映射成模板变量；② 渲染只读层。
   依赖：../yunying-PC/contract-tpl.js（window.CONTRACT_TPL.dockou，15 条）
   口径（05-合同管理 v2.0）：甲方＝浙江大唐袜业城有限公司；
   租期起止自填；每期租金；保证金每间×间数；系统不算违约金；
   线上签署后以最终盖章纸质件上传归档的结果为准。
   ============================================================ */
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 台账字段 → 模板变量（缺失的显式写「待填」，不藏起来） */
  function varsOf(c) {
    c = c || {};
    var years = String(c.year || '').split(/[–\-—~]/);
    var termStart = (years[0] || '').trim();
    var termEnd = (years[1] || '').trim();
    var isEnt = c.subject !== 'person';
    return {
      '甲方名称': '浙江大唐袜业城有限公司',
      '承租人': isEnt ? (c.corpName || '—') : (c.name || '—'),
      '证件号': isEnt ? (c.uscc || '91330681XXXXXX1234') : '330681********1234',
      '联系人': c.contact || '李经理',
      '联系电话': c.phone || '137****6677',
      '竞拍公告编号': 'JD2025-0812',
      '成交确认书编号': 'CJ2025-0827-' + (c.volume || ''),
      '摊位区域': c.shop || '—',
      '摊位型号': '精品摊 · I 型',
      '资源编号': c.volume || '—',
      '间数': c.rooms || 2,
      '租期起': termStart || '待填',
      '租期止': termEnd || '待填',
      '每期月数': 12,
      '每期租金': c.rent ? String(c.rent).replace(/^¥/, '') : '待填',
      '后续付款日': '8 月 15 日',
      '保证金单价': (c.bondPer || 20000).toLocaleString('en-US'),
      '保证金合计': ((c.bondPer || 20000) * (c.rooms || 2)).toLocaleString('en-US'),
      '装修完成期限': '2025 年 9 月 30 日',
      '开业日期': '2025 年 10 月 1 日',
      '环境影响费': '200',
      '滞纳金日率': '万分之五',
      '合同份数': 3,
      '甲方份数': 2,
      '乙方份数': 1,
      '签订日期': c.signDate || '（待签署）'
    };
  }

  function fill(text, vars) {
    return String(text || '').replace(/\{\{([^}]+)\}\}/g, function (m, k) {
      var v = vars[k];
      return (v === undefined || v === null || String(v).trim() === '') ? '（待填）' : String(v);
    });
  }

  function lines(c) {
    var tpl = (window.CONTRACT_TPL && window.CONTRACT_TPL.dockou) || [];
    var vars = varsOf(c);
    return tpl.map(function (l) { return fill(l, vars); });
  }

  /* 只读层：全屏覆盖，正文可滚动 */
  function show(c, opts) {
    opts = opts || {};
    hide();
    var arr = lines(c);
    var html = arr.map(function (l) {
      if (!l.trim()) return '<div style="height:6px"></div>';
      var isClause = /^[一二三四五六七八九十]+、/.test(l);
      if (isClause) {
        return '<p style="font-size:12.5px;font-weight:700;color:#1F2430;margin:10px 0 4px">' + esc(l) + '</p>';
      }
      return '<p style="font-size:12px;line-height:1.85;color:#374151;margin:0 0 4px">' + esc(l) + '</p>';
    }).join('');

    var mask = document.createElement('div');
    mask.id = 'ctBodyMask';
    mask.style.cssText = 'position:fixed;inset:0;z-index:400;background:#fff;display:flex;flex-direction:column;width:393px';
    mask.innerHTML =
      '<div style="background:linear-gradient(135deg,#4F46E5,#3730A3);padding:10px 14px 12px;color:#fff">'
      + '<div style="display:flex;align-items:center;justify-content:space-between">'
      + '<a onclick="SHCT.hide()" style="width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none"><i class="fas fa-chevron-left" style="font-size:12px"></i></a>'
      + '<span style="font-size:14px;font-weight:800">摊位租赁合同</span>'
      + '<span style="width:30px"></span></div>'
      + '<p style="font-size:10.5px;color:rgba(255,255,255,.8);margin:6px 0 0">'
      + esc((c && c.no) || '') + ' · ' + esc((c && c.ver) || 'v1') + ' · 只读 · 共 15 条'
      + '</p></div>'
      + '<div style="flex:1;overflow-y:auto;padding:14px 16px 26px;-webkit-overflow-scrolling:touch">'
      + '<div style="background:#EEF2FF;border:1px solid #DDD6FE;border-radius:12px;padding:8px 10px;margin-bottom:10px">'
      + '<p style="font-size:10px;line-height:1.7;color:#4338CA;margin:0"><i class="fas fa-circle-info" style="margin-right:4px"></i>'
      + '正文与运营端模板逐字一致（v2.0 · 15 条）；¥/期限/间数等由合同台账自动带出。'
      + '线上签署后以最终盖章纸质件上传归档的结果为准。</p></div>'
      + html
      + '<p style="font-size:10px;color:#9CA3AF;margin-top:14px;text-align:center">— 正文结束 —</p>'
      + '</div>'
      + (opts.footer || '');
    document.body.appendChild(mask);
  }

  function hide() {
    var m = document.getElementById('ctBodyMask');
    if (m) m.remove();
  }

  window.SHCT = { varsOf: varsOf, lines: lines, show: show, hide: hide };
})();
