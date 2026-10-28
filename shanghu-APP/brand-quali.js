/* 品牌资质（商户端共享模块）
 * 用于：shop-info-edit.html（店铺设置）、shanghu-verify.html（企业资质认证）
 * 状态：none 未提交 / reviewing 审核中 / pass 已通过 / reject 已驳回 / expired 已过期
 * 规则（待办 #41）：商标注册证 或 品牌授权书；最多 3 张；证书编号 + 有效期；
 *                 驳回/过期可重传 → 审核中；资质无效时不展示品牌店铺、不进买家端品牌馆。
 */
(function () {
  var KEY = 'sh_brand_quali_v1';

  function today() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function read() {
    var o = null;
    try { o = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { o = null; }
    return o || { status: 'none', type: '商标注册证', certNo: '', expiry: '', files: 0, reason: '', shopType: '普通店铺', updatedAt: '' };
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function valid(o) {
    return o.status === 'pass' && o.expiry && o.expiry >= today();
  }
  function effStatus(o) {
    if (o.status === 'pass' && o.expiry && o.expiry < today()) return 'expired';
    return o.status;
  }
  var META = {
    none: ['未提交', 'bg-gray-100 text-gray-500'],
    reviewing: ['审核中', 'bg-amber-50 text-amber-600'],
    pass: ['已通过', 'bg-emerald-50 text-emerald-600'],
    reject: ['已驳回', 'bg-rose-50 text-rose-500'],
    expired: ['已过期', 'bg-rose-50 text-rose-500']
  };

  /* ---------- 样式 ---------- */
  var css = ''
    + '.bq-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:400;opacity:0;pointer-events:none;transition:.22s;width:393px}'
    + '.bq-mask.on{opacity:1;pointer-events:auto}'
    + '.bq-sheet{position:fixed;left:0;right:0;bottom:0;width:393px;max-height:88vh;overflow-y:auto;background:#fff;border-radius:20px 20px 0 0;z-index:401;transform:translateY(100%);transition:transform .26s ease}'
    + '.bq-sheet.on{transform:translateY(0)}'
    + '.bq-up{border:1.5px dashed #D1D5DB;border-radius:12px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:3px;background:#fff;cursor:pointer}'
    + '.bq-opt{display:inline-block;padding:6px 11px;border-radius:999px;font-size:11px;background:#F3F4F6;color:#6B7280;border:1px solid transparent;cursor:pointer}'
    + '.bq-opt.on{background:#EFF6FF;color:#2563EB;border-color:#BFDBFE;font-weight:700}'
    + '.bq-toast{position:fixed;left:50%;top:46%;transform:translate(-50%,-50%) scale(.9);background:rgba(15,18,26,.92);color:#fff;padding:11px 18px;border-radius:12px;font-size:12px;z-index:500;opacity:0;pointer-events:none;transition:.2s;max-width:80%;text-align:center}'
    + '.bq-toast.on{opacity:1;transform:translate(-50%,-50%) scale(1)}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function toast(m) {
    var t = document.getElementById('bqToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'bqToast'; t.className = 'bq-toast';
      document.body.appendChild(t);
    }
    t.textContent = m; t.classList.add('on');
    clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove('on'); }, 1800);
  }

  /* ---------- 弹层（首次打开时注入） ---------- */
  function ensureSheet() {
    if (document.getElementById('bqSheet')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="bq-mask" id="bqMask" onclick="BQ.close()"></div>'
      + '<div class="bq-sheet" id="bqSheet">'
      + '  <div class="sticky top-0 bg-white px-4 pt-3 pb-2 border-b border-gray-50">'
      + '    <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-2"></div>'
      + '    <div class="flex items-center justify-between"><p class="text-[15px] font-extrabold text-gray-900">品牌资质</p><a onclick="BQ.close()" class="text-gray-400 text-[12px]">关闭</a></div>'
      + '    <p class="text-[10px] text-gray-400 mt-1">仅用于买家端「品牌馆」准入，与商品上下架无关</p>'
      + '  </div>'
      + '  <div class="px-4 py-3 pb-8">'
      + '    <p class="text-[11px] font-semibold text-gray-700 mb-1.5">资质类型 <span class="text-red-500">*</span></p>'
      + '    <div class="flex gap-1.5 mb-3" id="bqTypeBox"></div>'
      + '    <p class="text-[11px] font-semibold text-gray-700 mb-1.5">上传凭证（最多 3 张，图片或 PDF） <span class="text-red-500">*</span></p>'
      + '    <div class="grid grid-cols-3 gap-2 mb-1" id="bqFileBox"></div>'
      + '    <p class="text-[9px] text-gray-400 mb-3">商标注册证需含注册号与核定商品类别；品牌授权书需在授权期内且加盖双方公章。</p>'
      + '    <p class="text-[11px] font-semibold text-gray-700 mb-1.5">证书编号 <span class="text-red-500">*</span></p>'
      + '    <input id="bqCertNo" class="w-full text-[12px] bg-gray-50 rounded-xl px-3 py-2.5 outline-none num mb-3" placeholder="如：第 12345678 号">'
      + '    <div class="grid grid-cols-2 gap-2 mb-3">'
      + '      <div><p class="text-[11px] font-semibold text-gray-700 mb-1.5">有效期至 <span class="text-red-500">*</span></p><input id="bqExpiry" type="date" class="w-full text-[12px] bg-gray-50 rounded-xl px-3 py-2.5 outline-none num"></div>'
      + '      <div><p class="text-[11px] font-semibold text-gray-700 mb-1.5">品牌名称</p><div class="w-full text-[12px] bg-gray-50 rounded-xl px-3 py-2.5 text-gray-500">同店铺名称（不单独维护）</div></div>'
      + '    </div>'
      + '    <div id="bqRejectBox" class="rounded-xl p-2.5 mb-3" style="display:none;background:#FEF2F2"><p class="text-[10px] text-rose-600 leading-relaxed" id="bqRejectTxt"></p></div>'
      + '    <button onclick="BQ.submit()" class="w-full py-3 rounded-xl text-white text-[13px] font-bold" style="background:linear-gradient(135deg,#F59E0B,#D97706)">提交审核</button>'
      + '    <div id="bqDemoBox" class="mt-3 pt-3 border-t border-gray-50" style="display:none">'
      + '      <p class="text-[9px] text-gray-400 mb-1.5">演示：模拟平台审核结果</p>'
      + '      <div class="flex gap-2"><a onclick="BQ.demo(\'pass\')" class="flex-1 py-2 rounded-lg text-center text-[11px] font-bold" style="background:#ECFDF5;color:#059669">审核通过</a>'
      + '      <a onclick="BQ.demo(\'reject\')" class="flex-1 py-2 rounded-lg text-center text-[11px] font-bold" style="background:#FEF2F2;color:#DC2626">驳回</a></div>'
      + '    </div>'
      + '    <p class="text-[9px] text-gray-400 mt-3 leading-relaxed">资质审核与企业资质共用同一条审核通道；驳回或过期后重新提交，状态回到「审核中」。</p>'
      + '  </div>'
      + '</div>';
    document.body.appendChild(wrap);
    document.getElementById('bqTypeBox').innerHTML =
      '<span class="bq-opt" data-t="商标注册证">商标注册证</span>'
      + '<span class="bq-opt" data-t="品牌授权书">品牌授权书</span>';
    bindFiles();
  }

  var fileCount = 0;
  function bindFiles() {
    document.getElementById('bqTypeBox').addEventListener('click', function (e) {
      var el = e.target.closest('[data-t]');
      if (!el) return;
      document.querySelectorAll('#bqTypeBox [data-t]').forEach(function (x) { x.classList.remove('on'); });
      el.classList.add('on');
      var o = read(); o.type = el.getAttribute('data-t'); save(o);
    });
    document.getElementById('bqFileBox').addEventListener('click', function (e) {
      var el = e.target.closest('[data-f]');
      if (!el) return;
      if (fileCount >= 3) { toast('最多上传 3 张'); return; }
      fileCount++;
      renderFiles();
      toast('已选择 1 张凭证（演示）');
    });
  }
  function renderFiles() {
    var box = document.getElementById('bqFileBox');
    if (!box) return;
    var h = '';
    for (var i = 0; i < fileCount; i++) {
      h += '<div class="bq-up" data-f="1" style="border-style:solid;border-color:#BFDBFE;background:#F8FAFF"><i class="fas fa-file-image text-primary text-lg"></i><span class="text-[9px] text-gray-500">凭证 ' + (i + 1) + '</span></div>';
    }
    if (fileCount < 3) {
      h += '<div class="bq-up" data-f="1"><i class="fas fa-plus text-gray-300 text-lg"></i><span class="text-[9px] text-gray-400">+ 上传</span></div>';
    }
    box.innerHTML = h;
  }

  /* ---------- 卡片 ---------- */
  function render() {
    var el = document.getElementById('brandQualiCard');
    if (!el) return;
    var o = read();
    var s = effStatus(o);
    var m = META[s] || META.none;
    var body = '';
    if (s === 'none') {
      body = '<p class="text-[10px] text-gray-500 leading-relaxed">上传商标注册证或品牌授权书后，可申请将店铺升级为「品牌店铺」，并进入买家端品牌馆。</p>';
    } else if (s === 'reviewing') {
      body = '<p class="text-[10px] text-amber-600 leading-relaxed"><i class="fas fa-hourglass-half mr-1"></i>已提交 ' + (o.updatedAt || '') + '，平台审核中（1–2 个工作日）。审核期间不影响正常经营。</p>';
    } else if (s === 'pass') {
      body = '<div class="space-y-1 text-[11px]">'
        + '<div class="flex justify-between"><span class="text-gray-400">资质类型</span><span class="text-gray-700">' + o.type + '</span></div>'
        + '<div class="flex justify-between"><span class="text-gray-400">证书编号</span><span class="text-gray-700 num">' + (o.certNo || '—') + '</span></div>'
        + '<div class="flex justify-between"><span class="text-gray-400">有效期至</span><span class="text-gray-700 num">' + (o.expiry || '—') + '</span></div>'
        + '</div>';
    } else if (s === 'reject') {
      body = '<div class="rounded-lg p-2" style="background:#FEF2F2"><p class="text-[10px] text-rose-600 leading-relaxed"><b>驳回原因：</b>' + (o.reason || '资料不清晰，请重新上传') + '</p></div>';
    } else if (s === 'expired') {
      body = '<div class="rounded-lg p-2" style="background:#FEF2F2"><p class="text-[10px] text-rose-600 leading-relaxed">资质已于 <b>' + o.expiry + '</b> 过期，已退出买家端品牌馆（商品不下架）。请重新上传。</p></div>';
    }
    var act = '';
    if (s === 'none' || s === 'reject' || s === 'expired') {
      act = '<button onclick="BQ.open()" class="mt-2.5 w-full py-2 rounded-lg text-white text-[11px] font-bold" style="background:linear-gradient(135deg,#F59E0B,#D97706)">' + (s === 'none' ? '上传品牌资质' : '重新上传') + '</button>';
    } else if (s === 'reviewing') {
      act = '<button onclick="BQ.open()" class="mt-2.5 w-full py-2 rounded-lg text-[11px] font-bold text-gray-500 bg-gray-50">查看已提交资料</button>';
    } else {
      act = '<button onclick="BQ.open()" class="mt-2.5 w-full py-2 rounded-lg text-[11px] font-bold text-gray-500 bg-gray-50">更新资质</button>';
    }
    var hasQuali = valid(o);
    /* 到期 / 驳回 / 未通过 → 店铺类型自动降级为普通店铺（商品不删，仅退出品牌馆） */
    if (!hasQuali && o.shopType === '品牌店铺') { o.shopType = '普通店铺'; save(o); }
    var showBrand = hasQuali && o.shopType === '品牌店铺';
    el.innerHTML =
      '<div class="flex items-center justify-between mb-2">'
      + '<div class="flex items-center gap-2"><i class="fas fa-certificate text-amber-500 text-xs"></i><p class="text-[12px] font-bold text-gray-800">品牌资质</p></div>'
      + '<span class="' + m[1] + ' text-[9px] font-bold px-2 py-0.5 rounded">' + m[0] + (showBrand ? ' · 品牌馆' : '') + '</span>'
      + '</div>'
      + body + act
      + '<div class="mt-2.5 flex items-center justify-between pt-2.5 border-t border-gray-50">'
      + '<div><p class="text-[12px] font-medium text-gray-800">店铺类型</p><p class="text-[9px] text-gray-400">品牌店铺需资质通过且未过期</p></div>'
      + '<div class="flex gap-1.5">'
      + '<span class="bq-opt' + (!showBrand ? ' on' : '') + '" data-st="普通店铺" onclick="BQ.pickType(this)">普通店铺</span>'
      + '<span class="bq-opt' + (showBrand ? ' on' : '') + '" data-st="品牌店铺" onclick="BQ.pickType(this)">品牌店铺</span>'
      + '</div></div>'
      + '<p class="text-[9px] text-gray-400 mt-1.5"><i class="fas fa-circle-info mr-1"></i>资质失效只退出品牌馆，商品不会下架；驳回/过期可重传。</p>';
  }

  function open() {
    ensureSheet();
    var o = read();
    document.querySelectorAll('#bqTypeBox [data-t]').forEach(function (x) {
      x.classList.toggle('on', x.getAttribute('data-t') === o.type);
    });
    document.getElementById('bqCertNo').value = o.certNo || '';
    document.getElementById('bqExpiry').value = o.expiry || '';
    fileCount = o.files || 0;
    renderFiles();
    var rb = document.getElementById('bqRejectBox');
    if (o.status === 'reject') { rb.style.display = 'block'; document.getElementById('bqRejectTxt').textContent = '驳回原因：' + (o.reason || ''); }
    else rb.style.display = 'none';
    document.getElementById('bqDemoBox').style.display = (o.status === 'reviewing') ? 'block' : 'none';
    document.getElementById('bqMask').classList.add('on');
    document.getElementById('bqSheet').classList.add('on');
  }
  function close() {
    var m = document.getElementById('bqMask'), s = document.getElementById('bqSheet');
    if (m) m.classList.remove('on');
    if (s) s.classList.remove('on');
  }
  function submit() {
    var o = read();
    var no = (document.getElementById('bqCertNo').value || '').trim();
    var exp = document.getElementById('bqExpiry').value;
    if (!fileCount) { toast('请至少上传 1 张凭证'); return; }
    if (!no) { toast('请填写证书编号'); return; }
    if (!exp) { toast('请选择有效期'); return; }
    if (exp <= today()) { toast('有效期已过，请填写有效日期'); return; }
    o.status = 'reviewing'; o.certNo = no; o.expiry = exp;
    o.files = fileCount;
    o.updatedAt = today(); o.reason = '';
    save(o); close(); render(); toast('已提交，等待平台审核');
  }
  function demo(r) {
    var o = read();
    if (r === 'pass') { o.status = 'pass'; o.reason = ''; toast('演示：审核通过，店铺可申请品牌店铺'); }
    else { o.status = 'reject'; o.reason = '授权书未加盖品牌方公章，且证书编号与凭证不一致'; toast('演示：已驳回'); }
    save(o); close(); render();
  }
  function pickType(el) {
    var o = read();
    var t = el.getAttribute('data-st');
    if (t === '品牌店铺' && !valid(o)) {
      toast('需先通过品牌资质审核，已为你打开上传');
      open();
      return;
    }
    o.shopType = t; save(o); render();
    toast('店铺类型已切换为「' + t + '」');
  }

  window.BQ = { render: render, open: open, close: close, submit: submit, demo: demo, pickType: pickType };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
