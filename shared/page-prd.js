/* ==========================================================================
 * page-prd.js —— 原型页面「产品逻辑说明」挂载器（全端共用）
 *
 * 用法：原型页面 </body> 前加一行
 *   <script src="../shared/page-prd.js"></script>
 *
 * 删掉本文件 + 那一行 script → 页面完全恢复原样（无样式、无 DOM、无全局变量）
 * 说明内容来自 prd/{模块}.md（经 tools/build-prd.mjs 生成同名 .prd.html）
 * ========================================================================== */
(function () {
  'use strict';

  /* ---------- 唯一映射表 ----------
   * key   : 端目录/文件名
   * value : [本页说明文件（不带扩展，相对 prd/）, 锚点（一般留空）, 副标题]
   * 每个页面一份说明，抽屉只显示本页内容，不带其他页
   */
  var PRD_MAP = {
    'yunying-PC/resource-building.html':  ['02-市场资源管理/01-楼栋楼层管理', '', '楼栋楼层管理'],
    'yunying-PC/resource-unit.html':      ['02-市场资源管理/02-摊位商铺管理', '', '摊位商铺管理'],
    'yunying-PC/resource-floorplan.html': ['02-市场资源管理/03-平面图维护', '', '平面图维护'],
    'yunying-PC/resource-dashboard.html': ['02-市场资源管理/04-资源状态看板', '', '资源状态看板'],
    'yunying-PC/activity.html':           ['08-商户活动运营/01-活动列表', '', '活动列表'],
    'yunying-PC/activity-create.html':    ['08-商户活动运营/02-活动创建', '', '活动创建'],
    'yunying-PC/activity-approve.html':   ['08-商户活动运营/03-活动审批', '', '活动审批'],
    'yunying-PC/activity-signup.html':    ['08-商户活动运营/04-报名管理', '', '报名管理'],
    'yunying-PC/activity-checkin.html':   ['08-商户活动运营/05-签到管理', '', '签到管理'],
    'yunying-PC/activity-detail.html':    ['08-商户活动运营/06-活动详情', '', '活动详情'],
    'yunying-PC/content.html':            ['09-内容管理/01-资讯文章', '', '资讯文章'],
    'yunying-PC/content-notice.html':     ['09-内容管理/02-公告通知', '', '公告通知'],
    'yunying-PC/content-banner.html':     ['09-内容管理/03-Banner管理', '', 'Banner 管理'],
    'yunying-PC/content-index.html':      ['09-内容管理/04-产业指数发布', '', '产业指数发布'],
    'yunying-PC/content-push.html':       ['09-内容管理/05-消息推送', '', '消息推送'],
    'yunying-PC/merchant-auto.html':      ['04-商户管理/01-线下自动建档与同步', '', '线下自动建档与同步'],
    'yunying-PC/merchant-change.html':    ['04-商户管理/02-资料变更审核', '', '资料变更审核'],
    'yunying-PC/merchant-profile.html':   ['04-商户管理/03-商户档案', '', '商户档案'],
    'yunying-PC/merchant-rating.html':    ['04-商户管理/04-信用评级', '', '信用评级'],
    'yunying-PC/merchant-qual.html':      ['04-商户管理/05-资质与到期管理', '', '资质与到期管理'],
    'yunying-PC/merchant-exit.html':      ['04-商户管理/06-清退商户', '', '清退商户'],
    'yunying-PC/merchant-dunning.html':   ['04-商户管理/07-租金催缴', '', '租金催缴'],
    'yunying-PC/contract-template.html':  ['05-合同管理/01-合同模板管理', '', '合同模板管理'],
    'yunying-PC/contract-list.html':      ['05-合同管理/02-合同台账与签署留档', '', '合同台账与签署留档'],
    'yunying-PC/contract-change.html':    ['05-合同管理/03-合同变更审核', '', '合同变更审核'],
    'yunying-PC/contract-apply.html':     ['05-合同管理/04-合同发起与签署', '', '合同发起与签署'],
    'yunying-PC/chain-ip.html':           ['13-产业链服务/01-知识产权配置管理', '', '知识产权配置管理'],
    'yunying-PC/chain-tech-demand.html':  ['13-产业链服务/02-技术需求发布管理', '', '技术需求发布管理'],
    'yunying-PC/chain-tech-achv.html':    ['13-产业链服务/03-技术成果管理', '', '技术成果管理'],
    'yunying-PC/chain-policy.html':       ['13-产业链服务/04-政策发布', '', '政策发布'],
    'yunying-PC/chain-agency.html':       ['13-产业链服务/05-中介服务发布管理', '', '中介服务发布管理'],
    'yunying-PC/chain-finance.html':         ['13-产业链服务/06-金融-服务商管理', '', '金融服务商管理'],
    'yunying-PC/chain-recruit-company.html': ['13-产业链服务/07-招聘-企业管理', '', '招聘企业管理'],
    'yunying-PC/chain-recruit-job.html':     ['13-产业链服务/08-招聘-岗位管理', '', '招聘岗位管理'],
    'yunying-PC/chain-recruit-resume.html':  ['13-产业链服务/09-招聘-简历管理', '', '招聘简历管理'],
    'yunying-PC/chain-recruit-delivery.html':['13-产业链服务/10-招聘-投递管理', '', '招聘投递管理'],
    'yunying-PC/chain-recruit-audit.html':   ['13-产业链服务/11-招聘-招聘审核', '', '招聘审核'],
    'yunying-PC/chain-recruit-guide.html':   ['13-产业链服务/12-招聘-招聘指南', '', '招聘指南'],
    'yunying-PC/study-approve.html': ['14a-研学管理/01-报名审批', '', '报名审批'],
    'yunying-PC/study-group.html':   ['14a-研学管理/02-团体研学管理', '', '团体研学管理'],
    'yunying-PC/study-base.html':    ['14a-研学管理/03-研学基地管理', '', '研学基地管理'],
    'yunying-PC/study-route.html':   ['14a-研学管理/04-研学线路活动管理', '', '研学线路活动管理'],
    'yunying-PC/study-letter.html':  ['14a-研学管理/05-责任书模板管理', '', '责任书模板管理'],
    'yunying-PC/study-promo.html':   ['14a-研学管理/06-研学往期风采', '', '研学往期风采'],
    'yunying-PC/expo-list.html':            ['14b-袜博会管理/01-袜博会列表', '', '袜博会列表'],
    'yunying-PC/expo-booth.html':           ['14b-袜博会管理/02-展位申请管理', '', '展位申请管理'],
    'yunying-PC/expo-visitor.html':         ['14b-袜博会管理/03-参观申请管理', '', '参观申请管理'],
    'yunying-PC/expo-exhibitor.html':       ['14b-袜博会管理/04-参展商管理', '', '参展商管理'],
    'yunying-PC/expo-schedule-manage.html': ['14b-袜博会管理/05-日程安排管理', '', '日程安排管理'],
    'yunying-PC/expo-checkin.html':         ['14b-袜博会管理/06-签到管理', '', '签到管理'],
    'yunying-PC/expo-material.html':        ['14b-袜博会管理/07-资料管理', '', '资料管理'],
    'yunying-PC/expo-archive.html':         ['14b-袜博会管理/08-往期存档回顾', '', '往期存档回顾']
  };

  var parts = location.pathname.replace(/\\/g, '/').split('/');
  var file = parts.pop() || '';
  var seg = parts.pop() || '';
  var hit = PRD_MAP[seg + '/' + file] || PRD_MAP[file];
  if (!hit || !seg) return;

  var src = 'prd/' + hit[0] + '.prd.html' + (hit[1] ? '#' + hit[1] : '');
  var sub = hit[2] || '';

  var CSS = ''
    + '.pp-btn{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:6px;'
    + 'padding:8px 14px;border-radius:999px;background:#1F2430;color:#fff;font-size:12px;font-weight:600;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;'
    + 'box-shadow:0 6px 20px rgba(15,23,42,.25);cursor:pointer;border:0;transition:transform .15s,box-shadow .15s;opacity:.92}'
    + '.pp-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(15,23,42,.32);opacity:1}'
    + '.pp-mask{position:fixed;inset:0;background:rgba(15,23,42,.42);z-index:2147483001;display:none}'
    + '.pp-mask.on{display:block}'
    + '.pp-drawer{position:fixed;top:0;right:0;height:100%;width:min(880px,94vw);background:#fff;z-index:2147483002;'
    + 'display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(15,23,42,.18);transform:translateX(102%);'
    + 'transition:transform .22s ease}'
    + '.pp-drawer.on{transform:none}'
    + '.pp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;gap:12px;'
    + 'border-bottom:1px solid #E9EDF3;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif}'
    + '.pp-title{font-size:14px;font-weight:700;color:#1F2430;margin:0}'
    + '.pp-sub{font-size:11px;color:#94A3B8;margin:2px 0 0}'
    + '.pp-close{border:0;background:#F1F5F9;color:#64748B;width:28px;height:28px;border-radius:8px;cursor:pointer;'
    + 'font-size:15px;line-height:1;flex-shrink:0}'
    + '.pp-frame{flex:1;border:0;width:100%}';

  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  function mount() {
    var st = el('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var btn = el('button', 'pp-btn', '产品逻辑说明');
    btn.type = 'button';
    btn.title = '查看本页的页面 PRD';

    var mask = el('div', 'pp-mask');
    var drawer = el('div', 'pp-drawer');
    var head = el('div', 'pp-head');
    head.innerHTML = '<div><p class="pp-title">' + hit[0] + '</p><p class="pp-sub">'
      + (sub ? sub + ' · ' : '') + file + '</p></div>';
    var close = el('button', 'pp-close', '&times;');

    var frame = el('iframe', 'pp-frame');
    frame.setAttribute('loading', 'lazy');

    function open() {
      if (!frame.src) frame.src = src;
      mask.classList.add('on');
      drawer.classList.add('on');
    }
    function shut() {
      mask.classList.remove('on');
      drawer.classList.remove('on');
    }

    btn.addEventListener('click', open);
    close.addEventListener('click', shut);
    mask.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });

    head.appendChild(close);
    drawer.appendChild(head);
    drawer.appendChild(frame);

    document.body.appendChild(btn);
    document.body.appendChild(mask);
    document.body.appendChild(drawer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
