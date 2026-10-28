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
    'yunying-PC/expo-archive.html':         ['14b-袜博会管理/08-往期存档回顾', '', '往期存档回顾'],
    'yunying-PC/property-repair.html':     ['07-物业服务/01-报修工单', '', '报修工单'],
    'yunying-PC/property-request.html':    ['07-物业服务/02-交办单与核销', '', '交办单与核销'],
    'yunying-PC/property-budget.html':     ['07-物业服务/03-维修资金台账', '', '维修资金台账'],
    'yunying-PC/property-inspect.html':    ['07-物业服务/04-巡检管理', '', '巡检管理'],
    'yunying-PC/property-issue.html':      ['07-物业服务/05-问题上报', '', '问题上报'],
    'yunying-PC/property-rectify.html':    ['07-物业服务/06-整改管理', '', '整改管理'],
    'yunying-PC/property-complaint.html':  ['07-物业服务/07-投诉建议', '', '投诉建议'],
    'yunying-PC/mall-inquiry.html':       ['10a-采购询价/01-采购询价需求管理', '', '采购询价需求管理'],
    'yunying-PC/mall-order-inquiry.html': ['10a-采购询价/02-采购询价订单', '', '采购询价订单'],
    'yunying-PC/mall-custom-demand.html': ['10b-商城运营/01-个性定制需求管理', '', '个性定制需求管理'],
    'yunying-PC/mall-order-group.html':   ['10b-商城运营/02-拼单集采订单', '', '拼单集采订单'],
    'yunying-PC/mall-order-sample.html':  ['10b-商城运营/03-样品打样订单', '', '样品打样订单'],
    'yunying-PC/mall-order-custom.html':  ['10b-商城运营/04-定制订单', '', '定制订单'],
    'yunying-PC/mall-recommend.html':     ['10b-商城运营/05-推荐位管理', '', '推荐位管理'],

    /* ===== 移动端 · 功能族（值指向 _views/ 下的单页视图，不是族文档） ===== */
    'mai-APP/home.html':              ['_views/F01-首页与导航-p1', '', '首页'],
    'mai-APP/search.html':            ['_views/F01-首页与导航-p2', '', '搜索'],
    'mai-APP/video.html':             ['_views/F01-首页与导航-p3', '', '视频看货'],
    'mai-APP/ai.html':                ['_views/F01-首页与导航-p4', '', 'AI 工具'],
    'mai-APP/messages.html':          ['_views/F01-首页与导航-p5', '', '消息中心'],
    'mai-APP/news-detail.html':       ['_views/F01-首页与导航-p6', '', '资讯详情'],

    'mai-APP/study-tour.html':        ['_views/F10-文旅研学-p1', '', '研学首页'],
    'mai-APP/study-route.html':       ['_views/F10-文旅研学-p2', '', '路线详情'],
    'mai-APP/study-personal.html':    ['_views/F10-文旅研学-p3', '', '个人报名'],
    'mai-APP/study-apply.html':       ['_views/F10-文旅研学-p4', '', '团体申请'],
    'mai-APP/study-my.html':          ['_views/F10-文旅研学-p5', '', '报名详情'],
    'mai-APP/tourism.html':           ['_views/F10-文旅研学-p6', '', '文旅活动'],
    'mai-APP/tourism-detail.html':    ['_views/F10-文旅研学-p7', '', '活动详情'],
    'mai-APP/tourism-resource.html':  ['_views/F10-文旅研学-p8', '', '文旅资源详情'],

    'mai-APP/expo.html':              ['_views/F11-袜博会-p1', '', '展会首页'],
    'mai-APP/expo-info.html':         ['_views/F11-袜博会-p2', '', '展会介绍'],
    'mai-APP/expo-schedule.html':     ['_views/F11-袜博会-p3', '', '展会日程'],
    'mai-APP/expo-session-detail.html':['_views/F11-袜博会-p4', '', '日程详情'],
    'mai-APP/expo-visitor-apply.html':['_views/F11-袜博会-p5', '', '参观登记'],
    'mai-APP/expo-materials.html':    ['_views/F11-袜博会-p6', '', '资料下载'],
    'mai-APP/expo-booth-apply.html':  ['_views/F11-袜博会-p7', '', '展位申请'],

    'mai-APP/product-filter.html':    ['_views/F02-市场与找货-p1', '', '商品列表'],
    'mai-APP/product-detail.html':    ['_views/F02-市场与找货-p2', '', '商品详情'],
    'mai-APP/photo-search.html':      ['_views/F02-市场与找货-p3', '', '拍照找货'],
    'mai-APP/ai-search.html':         ['_views/F02-市场与找货-p4', '', 'AI 找货'],
    'mai-APP/market-socks.html':      ['_views/F02-市场与找货-p5', '', '袜子市场'],
    'mai-APP/market-map.html':        ['_views/F02-市场与找货-p6', '', '市场导览'],

    'mai-APP/ranking-terminal.html':  ['_views/F03-榜单与品牌-p1', '', '终端热销榜'],
    'mai-APP/ranking-search.html':    ['_views/F03-榜单与品牌-p2', '', '平台热搜榜'],
    'mai-APP/ranking-new.html':       ['_views/F03-榜单与品牌-p3', '', '新品关注榜'],
    'mai-APP/ranking-cross.html':     ['_views/F03-榜单与品牌-p4', '', '跨境热销榜'],
    'mai-APP/brand.html':             ['_views/F03-榜单与品牌-p5', '', '品牌馆'],
    'mai-APP/brand-detail.html':      ['_views/F03-榜单与品牌-p6', '', '品牌详情'],

    'mai-APP/group-buy.html':         ['_views/F04-拼单集采-p1', '', '拼单集采'],
    'mai-APP/group-buy-join.html':    ['_views/F04-拼单集采-p2', '', '拼单详情'],
    'mai-APP/group-records.html':     ['_views/F04-拼单集采-p3', '', '拼单记录'],

    'mai-APP/purchase-order.html':    ['_views/F07-交易与订单-p1', '', '进货单'],
    'mai-APP/order-checkout.html':    ['_views/F07-交易与订单-p2', '', '确认订单'],
    'mai-APP/orders.html':            ['_views/F07-交易与订单-p3', '', '我的订单'],
    'mai-APP/order-detail.html':      ['_views/F07-交易与订单-p4', '', '订单详情'],
    'mai-APP/order-detail-inquiry.html':['_views/F07-交易与订单-p5', '', '询价订单详情'],
    'mai-APP/order-reviewed.html':    ['_views/F07-交易与订单-p6', '', '已评价订单'],
    'mai-APP/purchase-records.html':  ['_views/F07-交易与订单-p7', '', '采购记录'],
    'mai-APP/address.html':           ['_views/F07-交易与订单-p8', '', '收货地址'],
    'mai-APP/complaint.html':         ['_views/F07-交易与订单-p9', '', '投诉建议'],

    'mai-APP/inquiry.html':           ['_views/F08-采购询价与定制-p1', '', '采购询价'],
    'mai-APP/inquiry-publish.html':   ['_views/F08-采购询价与定制-p2', '', '发布采购询价'],
    'mai-APP/inquiry-mypublish.html': ['_views/F08-采购询价与定制-p3', '', '我的发布详情'],
    'mai-APP/inquiry-demand.html':    ['_views/F08-采购询价与定制-p4', '', '公开需求详情'],
    'mai-APP/custom-design.html':     ['_views/F08-采购询价与定制-p5', '', '个性定制'],
    'mai-APP/bulk-custom.html':       ['_views/F08-采购询价与定制-p6', '', '批量定制'],
    'mai-APP/ai-outfit.html':         ['_views/F08-采购询价与定制-p7', '', 'AI 穿搭']
  };

  var parts = location.pathname.replace(/\\/g, '/').split('/');
  var file = parts.pop() || '';
  var seg = parts.pop() || '';
  var hit = PRD_MAP[seg + '/' + file] || PRD_MAP[file];

  /* 宿主文档：从直接父级逐层向上，找「最近一个可访问（同源）的父文档」。
     为什么不直接用 window.top：IDE 预览常把整个外壳再套一层 iframe，最外层通常跨域不可读，
     而直接父级（我们的预览壳 index-app-mai.html）是同源、可挂载的。 */
  var TOP = (function () {
    var w = window;
    for (var i = 0; i < 6; i++) {
      var p;
      try { p = w.parent; } catch (e) { break; }
      if (!p || p === w) break;
      var ok = false;
      try { ok = !!(p.document && (p.document.body || p.document.documentElement)); } catch (e) { ok = false; }
      if (ok) return p;          // 最近可访问祖先 → 挂这里
      w = p;                     // 不可访问则继续向上找
    }
    return window;
  })();
  var DOC = TOP.document;
  var EMBED = DOC !== document;
  var IS_FRAME = false;
  try { IS_FRAME = !!(window.parent && window.parent !== window); } catch (e) { IS_FRAME = true; }

  function cleanupTop() {
    try {
      var r = DOC.getElementById('__ppd_root');
      if (r && r.parentNode) r.parentNode.removeChild(r);
    } catch (e) {}
  }
  function cleanupSelf() {
    var r = document.getElementById('__ppd_root');
    if (r && r.parentNode) r.parentNode.removeChild(r);
  }
  function tellParent(msg) {
    try { window.parent.postMessage(msg, '*'); } catch (e) {}
  }

  /* 本页没有说明（或导航到无说明页）时：清掉残留抽屉，并让外壳撤掉按钮 */
  if (!hit || !seg) {
    if (EMBED) cleanupTop();
    else if (IS_FRAME) { tellParent({ type: 'ppd:hide' }); setTimeout(function () { tellParent({ type: 'ppd:hide' }); }, 200); }
    return;
  }

  var src = 'prd/' + hit[0] + '.prd.html' + (hit[1] ? '#' + hit[1] : '');
  var sub = hit[2] || '';
  /* 移动端单页视图路径形如 _views/F10-文旅研学-p3：标题回显功能族名，不显示内部路径 */
  var fam = hit[0].replace(/^_views\//, '').replace(/-p\d+$/, '');

  /* 嵌入手机框时抽屉占右侧空白区；独立打开时保持原宽度 */
  var PANEL_W = EMBED ? 'min(760px,46vw)' : 'min(880px,94vw)';

  var CSS = ''
    + '.pp-btn{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:6px;'
    + 'padding:8px 14px;border-radius:999px;background:#1F2430;color:#fff;font-size:12px;font-weight:600;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;'
    + 'box-shadow:0 6px 20px rgba(15,23,42,.25);cursor:pointer;border:0;'
    + 'transition:transform .15s,box-shadow .15s,opacity .18s,left .2s ease,right .2s ease,top .2s ease,bottom .2s ease;opacity:.92}'
    + '.pp-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(15,23,42,.32);opacity:1}'
    + '.pp-btn.on-dark{background:#fff;color:#1F2430;box-shadow:0 8px 24px rgba(0,0,0,.35)}'
    + '.pp-mask{position:fixed;inset:0;background:rgba(15,23,42,.42);z-index:2147483001;display:none}'
    + '.pp-mask.on{display:block}'
    + '.pp-drawer{position:fixed;top:0;right:0;height:100%;width:' + PANEL_W + ';background:#fff;z-index:2147483002;'
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
    var n = DOC.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  function mount() {
    /* 每次挂载先清掉上一份（iframe 内跳页时，父文档里的旧抽屉不会自动消失） */
    var old = DOC.getElementById('__ppd_root');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var root = DOC.createElement('div');
    root.id = '__ppd_root';

    var st = DOC.createElement('style');
    st.textContent = CSS;
    root.appendChild(st);

    var btn = el('button', 'pp-btn' + (EMBED ? ' on-dark' : ''), '产品逻辑说明');
    btn.type = 'button';
    btn.title = '查看本页的页面 PRD' + (EMBED ? '（右侧面板）' : '（页内）');
    try { console.log('[page-prd] host=' + (EMBED ? 'parent' : 'self') + ' size=' + DOC.documentElement.clientWidth + 'x' + DOC.documentElement.clientHeight); } catch (e) {}

    /* 嵌入手机框预览时不加遮罩：右侧可读说明，左侧手机原型仍可见 */
    var mask = EMBED ? null : el('div', 'pp-mask');

    var drawer = el('div', 'pp-drawer');
    var head = el('div', 'pp-head');
    head.innerHTML = '<div><p class="pp-title">' + fam + '</p><p class="pp-sub">'
      + (sub ? sub + ' · ' : '') + file + '</p></div>';
    var close = el('button', 'pp-close', '&times;');

    var frame = el('iframe', 'pp-frame');
    frame.setAttribute('loading', 'lazy');

    function open() {
      if (!frame.src) frame.src = src;
      if (mask) mask.classList.add('on');
      drawer.classList.add('on');
    }
    function shut() {
      if (mask) mask.classList.remove('on');
      drawer.classList.remove('on');
    }

    btn.addEventListener('click', open);
    close.addEventListener('click', shut);
    if (mask) mask.addEventListener('click', shut);
    DOC.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });

    head.appendChild(close);
    drawer.appendChild(head);
    drawer.appendChild(frame);

    root.appendChild(btn);
    if (mask) root.appendChild(mask);
    root.appendChild(drawer);
    (DOC.body || DOC.documentElement).appendChild(root);

    /* ===== 自动避让：按钮不许压住业务抽屉 / 弹层的操作区 =====
       本按钮 z-index 高于业务抽屉（.drawer z-index 50），停右下会正好盖住
       抽屉底部的「保存并同步 / 确认」等操作栏。这里改为：一旦检测到
       可见的大尺寸浮层与按钮相交，就把按钮让到该浮层左侧；左侧也放不下
       则退到其上方；都放不下才隐藏。 */
    var AVOID_SEL = '[class*="drawer"],[class*="modal"],[class*="sheet"],[class*="dialog"],[class*="popup"]';
    var SKIP_RE = /(mask|overlay|backdrop)/i;   /* 全屏透明遮罩不算遮挡物，否则永远判定铺满 */
    var avoidTimer = 0;

    function doAvoid() {
      /* 先复位成默认位置，再重新判；复位后 rect 才是基准 */
      btn.style.left = 'auto';
      btn.style.right = '18px';
      btn.style.bottom = '18px';
      btn.style.top = 'auto';
      btn.style.opacity = '';
      btn.style.pointerEvents = '';

      var b = btn.getBoundingClientRect();
      if (!b.width) return;

      var nodes = DOC.querySelectorAll(AVOID_SEL);
      var cover = null;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (SKIP_RE.test(n.className || '')) continue;
        var cs = DOC.defaultView.getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
        var r = n.getBoundingClientRect();
        /* 太小的是标签/小卡片，不是浮层；移出屏幕的抽屉 rect.left 会超出视口，自然不相交 */
        if (r.width < 140 || r.height < 120) continue;
        if (r.right > b.left && r.left < b.right && r.bottom > b.top && r.top < b.bottom) { cover = r; break; }
      }
      if (!cover) return;

      var GAP = 14;
      /* 窄屏（移动端）的浮层基本都是全宽全高，让到哪儿都还在内容上 → 直接收起 */
      if ((DOC.documentElement.clientWidth || 0) < 600) {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
        return;
      }
      var lp = cover.left - b.width - GAP;
      if (lp >= 10) {                       /* ① 让到浮层左侧 */
        btn.style.right = 'auto';
        btn.style.left = lp + 'px';
        return;
      }
      var tp = cover.top - b.height - GAP;
      if (tp >= 10) {                       /* ② 让到浮层上方 */
        btn.style.bottom = 'auto';
        btn.style.top = tp + 'px';
        return;
      }
      btn.style.opacity = '0';              /* ③ 浮层铺满：暂时收起 */
      btn.style.pointerEvents = 'none';
    }

    /* 抽屉带 0.22~0.26s 的滑入/滑出过渡：单次采样必然抓到中间态（rect 还在移动），
       因此在动画过程中的多个时点各采一次，动画结束后那次才算数。 */
    function avoid() {
      if (avoidTimer) return;
      avoidTimer = 1;
      var delays = [40, 220, 460, 720];
      for (var i = 0; i < delays.length; i++) setTimeout(doAvoid, delays[i]);
      setTimeout(function () { avoidTimer = 0; }, 800);
    }

    /* 抽屉靠切 class 开合 → 监听 class；个别页面用 style 控制 → 点击后再兜一次 */
    try {
      var mo = new (DOC.defaultView.MutationObserver || window.MutationObserver)(avoid);
      /* class 变化 = 抽屉开合；childList = 弹层被动态插入（先设好 class 再 append，不会有 class 变更记录） */
      mo.observe(DOC.body || DOC.documentElement, {
        attributes: true, subtree: true, attributeFilter: ['class'], childList: true
      });
    } catch (e) {}
    DOC.addEventListener('click', function () { setTimeout(avoid, 60); setTimeout(avoid, 360); }, true);
    DOC.addEventListener('resize', avoid);
    avoid();
  }

  function start() {
    /* 1) 独立打开，或父文档同源可访问 → 直接挂（优先父级） */
    if (!IS_FRAME || EMBED) { mount(); return; }

    /* 2) 跨域 iframe（IDE 预览常见）：交给外壳渲染，子页不画按钮 */
    var absSrc = src;
    try { absSrc = new URL(src, location.href).href; } catch (e) {}
    var payload = { type: 'ppd:hello', src: absSrc, title: fam, sub: sub, file: file };
    var bridged = false;
    try { console.log('[page-prd] cross-origin iframe → postMessage to shell'); } catch (e) {}

    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'ppd:ack') {
        bridged = true;
        cleanupSelf();
        try { console.log('[page-prd] ack: panel rendered by shell'); } catch (e2) {}
      }
    });

    /* 手机内点击不再关闭面板：避免每次操作都左右移动；切页由 ppd:hello 原地刷新 */

    tellParent(payload);
    setTimeout(function () { if (!bridged) tellParent(payload); }, 150);
    setTimeout(function () { if (!bridged) tellParent(payload); }, 450);
    /* 3) 外壳没有桥接 → 退回页内（800ms 后） */
    setTimeout(function () { if (!bridged) mount(); }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
