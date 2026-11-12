/* sp-take.js —— 商户端打样单「接单」弹层（承诺打样周期 / 预计完成时间）
 *
 * 为什么抽成共用文件：orders.html（列表「接单」）与 order-detail.html（详情「接单」）两处入口必须同一口径，
 * 否则一边能填周期、另一边只能 toast，买家端拿到的数据就会不一致。
 * 口径依据：PM 2026-11-12 裁决——两项均选填；不填则买家端不展示任何周期/预计时间（BR-24），不得由平台推算。
 * 交互依据：移动端规范——底部弹层（抓手条 / 20px 圆角 / 安全区留白）、控件 44px 高、胶囊快捷选项；
 *          日期不用原生 input[type=date]（桌面浏览器会弹日历面板，不符合移动端）。
 *
 * 用法：
 *   openTakeSheet({days:'', eta:'YYYY-MM-DD'}, function(days, eta){ ...确认后回调... });
 *   closeTakeSheet();   // 取消/点遮罩时不回调
 */
(function () {
  if (window.openTakeSheet) return;

  var CSS = [
    '.st-mask{position:fixed;top:0;bottom:0;left:50%;transform:translateX(-50%);width:393px;background:rgba(17,24,39,.45);z-index:300}',
    '.st-mask.st-eta{z-index:340}',
    '.st-sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:20px 20px 0 0;padding:8px 16px 30px;animation:stUp .22s ease both}',
    '@keyframes stUp{from{transform:translateY(40px);opacity:.5}to{transform:none;opacity:1}}',
    '.st-bar{width:36px;height:4px;border-radius:2px;background:#E5E7EB;margin:0 auto 12px}',
    '.st-hd{display:flex;align-items:center;justify-content:space-between}',
    '.st-title{font-size:16px;font-weight:800;color:#111827;margin:0}',
    '.st-link{font-size:13px;color:#6B7080;padding:4px 0}',
    '.st-link.ok{color:#059669;font-weight:700}',
    '.st-x{width:28px;height:28px;border-radius:50%;background:#F3F4F6;color:#9CA3AF;display:flex;align-items:center;justify-content:center;font-size:12px}',
    '.st-tip{font-size:11px;color:#9CA3AF;line-height:1.6;margin:6px 0 0}',
    '.st-lbl{font-size:11px;color:#6B7080;font-weight:500;display:block;margin:16px 0 6px}',
    '.st-field{display:flex;align-items:center;gap:8px;background:#F8F9FB;border:1px solid #EEF0F4;border-radius:12px;padding:0 13px;height:44px}',
    '.st-field:focus-within{border-color:#10B981;background:#fff}',
    '.st-field input{flex:1;min-width:0;border:0;outline:none;background:transparent;font-size:13px;color:#1F2430;height:100%;font-family:inherit}',
    '.st-field input::placeholder{color:#C0C0C0}',
    '.st-field .val{flex:1;font-size:13px;color:#C0C0C0}',
    '.st-unit{font-size:12px;color:#9CA3AF;flex-shrink:0}',
    '.st-chips{display:flex;gap:8px;margin-bottom:8px}',
    '.st-chip{display:inline-block;padding:7px 14px;border-radius:999px;border:1px solid #EEF0F4;background:#F8F9FB;font-size:12px;color:#6B7080}',
    '.st-chip.on{border-color:#10B981;background:#ECFDF5;color:#059669;font-weight:600}',
    '.st-btns{display:flex;gap:12px;margin-top:24px}',
    '.st-btn{flex:1;padding:12px 0;border-radius:12px;font-size:13px;text-align:center}',
    '.st-cancel{border:1px solid #E5E7EB;color:#4B5563}',
    '.st-ok{color:#fff;font-weight:700;background:linear-gradient(135deg,#10B981,#059669)}',
    '.st-eta-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:12px;font-size:13px;color:#374151;margin-bottom:4px}',
    '.st-eta-row.on{background:#ECFDF5;color:#059669;font-weight:600}',
    '.st-eta-row .ago{font-size:10px;color:#9CA3AF;margin-right:4px}'
  ].join('');

  var HTML =
    '<div id="stSheet" class="st-mask" style="display:none">' +
      '<div class="st-sheet">' +
        '<div class="st-bar"></div>' +
        '<div class="st-hd"><p class="st-title">确认接单</p>' +
          '<span class="st-x" data-act="close"><i class="fas fa-xmark"></i></span></div>' +
        '<p class="st-tip">两项均选填。不填则买家端不展示任何周期或预计时间（BR-24），不得由平台推算。</p>' +
        '<label class="st-lbl">承诺打样周期（选填）</label>' +
        '<div class="st-chips">' +
          '<a class="st-chip" data-d="3">3 天</a>' +
          '<a class="st-chip" data-d="5">5 天</a>' +
          '<a class="st-chip" data-d="7">7 天</a>' +
          '<a class="st-chip" data-d="0">不承诺</a>' +
        '</div>' +
        '<div class="st-field"><input id="stDays" type="text" inputmode="numeric" placeholder="其他天数，如 10"><span class="st-unit">天</span></div>' +
        '<label class="st-lbl">预计完成时间（选填）</label>' +
        '<div class="st-field" data-act="eta" style="cursor:pointer">' +
          '<span id="stEtaTxt" class="val">点此选择日期</span>' +
          '<i class="fas fa-calendar-day" style="color:#D1D5DB;font-size:12px"></i></div>' +
        '<div class="st-btns">' +
          '<a class="st-btn st-cancel" data-act="close">取消</a>' +
          '<a class="st-btn st-ok" data-act="ok">确认接单</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="stEtaSheet" class="st-mask st-eta" style="display:none">' +
      '<div class="st-sheet">' +
        '<div class="st-bar"></div>' +
        '<div class="st-hd">' +
          '<a class="st-link" data-act="eta-close">取消</a>' +
          '<p class="st-title" style="font-size:14px">预计完成时间</p>' +
          '<a class="st-link ok" data-act="eta-ok">确定</a></div>' +
        '<div class="st-chips" style="margin-top:12px">' +
          '<a class="st-chip" data-quick="3">3 天后</a>' +
          '<a class="st-chip" data-quick="5">5 天后</a>' +
          '<a class="st-chip" data-quick="7">7 天后</a>' +
          '<a class="st-chip" data-quick="0">不设定</a>' +
        '</div>' +
        '<div id="stEtaList" style="margin-top:8px;max-height:250px;overflow-y:auto;-webkit-overflow-scrolling:touch"></div>' +
      '</div>' +
    '</div>';

  var etaPick = '';
  var onOk = null;

  function $(id) { return document.getElementById(id); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtD(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function label(v) {
    var p = v.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    var wk = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    return (+p[1]) + '月' + (+p[2]) + '日 ' + wk;
  }

  function setEta(v) {
    etaPick = v || '';
    var txt = $('stEtaTxt');
    if (!txt) return;
    txt.textContent = etaPick ? label(etaPick) : '点此选择日期';
    txt.style.color = etaPick ? '#1F2430' : '#C0C0C0';
  }

  function syncDaysChip() {
    var v = ($('stDays').value || '').trim().replace(/[^\d]/g, '');
    var chips = document.querySelectorAll('#stSheet .st-chip[data-d]');
    for (var i = 0; i < chips.length; i++) {
      var d = chips[i].getAttribute('data-d');
      chips[i].classList.toggle('on', v === '' ? d === '0' : d === v);
    }
  }

  function openEta() {
    var list = $('stEtaList');
    var t = today().getTime();
    var h = '';
    for (var i = 1; i <= 30; i++) {
      var v = fmtD(new Date(t + i * 86400000));
      var on = v === etaPick;
      h += '<div class="st-eta-row' + (on ? ' on' : '') + '" data-d="' + v + '">'
        + '<span>' + label(v) + '</span>'
        + '<span class="ago">' + i + ' 天后</span>'
        + '<i class="fas fa-check" style="display:' + (on ? 'inline' : 'none') + '"></i></div>';
    }
    list.innerHTML = h;
    $('stEtaSheet').style.display = 'block';
    var cur = list.querySelector('.st-eta-row.on');
    if (cur) cur.scrollIntoView({ block: 'center' });
  }

  function pickRow(row) {
    var rows = document.querySelectorAll('#stEtaList .st-eta-row');
    for (var i = 0; i < rows.length; i++) {
      rows[i].classList.remove('on');
      rows[i].querySelector('i').style.display = 'none';
    }
    row.classList.add('on');
    row.querySelector('i').style.display = 'inline';
    etaPick = row.getAttribute('data-d');
    var qs = document.querySelectorAll('#stEtaSheet .st-chip');
    for (var j = 0; j < qs.length; j++) qs[j].classList.remove('on');
  }

  function closeEta() { $('stEtaSheet').style.display = 'none'; }

  function closeSheet() {
    $('stSheet').style.display = 'none';
    closeEta();
    onOk = null;
  }

  function mount() {
    if ($('stSheet')) return;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    var wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap);

    var sheet = $('stSheet');
    sheet.addEventListener('click', function (e) {
      var el = e.target.closest('[data-act]');
      if (!el) {
        // 点遮罩关闭
        if (e.target === sheet) closeSheet();
        return;
      }
      var act = el.getAttribute('data-act');
      if (act === 'close') return closeSheet();
      if (act === 'eta') return openEta();
      if (act === 'ok') {
        var days = +($('stDays').value || '').replace(/[^\d]/g, '') || 0;
        var eta = etaPick || '';
        var cb = onOk;
        closeSheet();
        if (cb) cb(days, eta);
        return;
      }
    });

    var chips = sheet.querySelectorAll('.st-chip[data-d]');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        $('stDays').value = this.getAttribute('data-d') === '0' ? '' : this.getAttribute('data-d');
        syncDaysChip();
      });
    }
    $('stDays').addEventListener('input', syncDaysChip);

    var etaSheet = $('stEtaSheet');
    etaSheet.addEventListener('click', function (e) {
      if (e.target === etaSheet) return closeEta();
      var q = e.target.closest('[data-quick]');
      if (q) {
        var n = +q.getAttribute('data-quick');
        if (!n) { setEta(''); return closeEta(); }
        setEta(fmtD(new Date(today().getTime() + n * 86400000)));
        return closeEta();
      }
      var row = e.target.closest('.st-eta-row');
      if (row) return pickRow(row);
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'eta-close') return closeEta();
      if (a === 'eta-ok') { setEta(etaPick); closeEta(); }
    });
  }

  window.openTakeSheet = function (opts, cb) {
    mount();
    opts = opts || {};
    $('stDays').value = opts.days || '';
    setEta(opts.eta || '');
    syncDaysChip();
    onOk = cb;
    $('stSheet').style.display = 'block';
  };
  window.closeTakeSheet = closeSheet;
})();
