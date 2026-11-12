/* 收货地址簿（买家端共享）
 * 下单页 / 定制需求页 / 地址管理页共用同一份地址：默认地址自动带出，可切换、可修改。
 * 存储：localStorage（file:// 或隐私模式下不可用时退化为内存态，同一页面内仍可用）
 *
 * 用法：
 *   AddrBook.list()                 -> [{id,name,phone,full,tag,isDefault}]
 *   AddrBook.getDefault()           -> 默认地址对象
 *   AddrBook.save(list)             -> 全量写回
 *   AddrBook.setDefault(id)
 *   AddrBook.pick({title,onPick})   -> 底部抽屉选地址，选中回填
 *   AddrBook.text(a)                -> "王建国 138****6688"
 *   AddrBook.full(a)                -> "浙江省…A 区 12 号档口"
 */
(function () {
  var KEY = 'mai_addr_book_v1';

  var SEED = [
    { id: 1, name: '王建国', phone: '138****6688', full: '浙江省绍兴市诸暨市大唐街道袜业城 A 区 12 号档口', tag: '档口', isDefault: true },
    { id: 2, name: '王建国', phone: '138****6688', full: '浙江省诸暨市大唐街道袜业城 B 区 12 栋 3 楼 301 室', tag: '仓库', isDefault: false },
    { id: 3, name: '李芳', phone: '139****6666', full: '浙江省义乌市稠江街道国际商贸城 H 区 2 楼 2088 号', tag: '公司', isDefault: false }
  ];

  var mem = null;
  function clone(a) { return JSON.parse(JSON.stringify(a)); }

  function list() {
    if (mem) return mem;
    try {
      var s = window.localStorage.getItem(KEY);
      if (s) {
        var arr = JSON.parse(s);
        if (Array.isArray(arr) && arr.length) { mem = arr; return mem; }
      }
    } catch (e) { }
    mem = clone(SEED);
    return mem;
  }

  function save(arr) {
    mem = arr;
    try { window.localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) { }
  }

  function getDefault() {
    var l = list();
    for (var i = 0; i < l.length; i++) if (l[i].isDefault) return l[i];
    return l[0] || null;
  }

  function setDefault(id) {
    var l = list();
    l.forEach(function (a) { a.isDefault = (String(a.id) === String(id)); });
    save(l);
  }

  function text(a) { return a ? a.name + ' ' + a.phone : ''; }
  function full(a) { return a ? a.full : ''; }

  /* ===== 地址选择抽屉 ===== */
  var CSS_ID = 'addr-book-style';
  function injectStyle() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement('style');
    st.id = CSS_ID;
    st.textContent =
      '#abMask{position:fixed;inset:0;background:rgba(15,18,26,.45);z-index:9000;display:none}' +
      '#abMask.on{display:block}' +
      '#abSheet{position:absolute;left:0;right:0;bottom:0;max-height:78%;background:#F7F8FA;border-radius:20px 20px 0 0;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .26s cubic-bezier(.32,.72,0,1)}' +
      '#abMask.on #abSheet{transform:translateY(0)}' +
      '.ab-head{display:flex;align-items:center;padding:14px 14px 10px;border-bottom:1px solid #EEF0F3;background:#fff;border-radius:20px 20px 0 0}' +
      '.ab-head b{font-size:14px;color:#1F2430}' +
      '.ab-head .ab-mng{margin-left:auto;font-size:11px;color:#FF4D2D;font-weight:600}' +
      '.ab-list{padding:10px 12px 4px;overflow-y:auto;flex:1}' +
      '.ab-item{background:#fff;border:1.5px solid transparent;border-radius:14px;padding:11px 12px;margin-bottom:9px;position:relative}' +
      '.ab-item.sel{border-color:#FF4D2D;background:#FFF8F5}' +
      '.ab-item .ab-top{display:flex;align-items:center;gap:6px}' +
      '.ab-item .ab-nm{font-size:13px;font-weight:800;color:#1F2430}' +
      '.ab-item .ab-ph{font-size:11.5px;color:#64748B}' +
      '.ab-item .ab-tg{font-size:9px;padding:1px 6px;border-radius:999px;background:#FFF0E8;color:#FF4D2D}' +
      '.ab-item .ab-ft{display:flex;align-items:flex-start;gap:5px;margin-top:6px}' +
      '.ab-item .ab-ft i{font-size:10px;color:#FF4D2D;margin-top:2px}' +
      '.ab-item .ab-ft p{font-size:11.5px;color:#475569;line-height:1.6}' +
      '.ab-item .ab-ic{position:absolute;right:12px;bottom:12px;width:17px;height:17px;border-radius:50%;border:1.5px solid #D5DAE1;display:flex;align-items:center;justify-content:center;color:transparent;font-size:9px}' +
      '.ab-item.sel .ab-ic{background:#FF4D2D;border-color:#FF4D2D;color:#fff}' +
      '.ab-foot{padding:10px 14px 18px;background:#fff;border-top:1px solid #EEF0F3}' +
      '.ab-foot button{width:100%;padding:11px 0;border-radius:999px;border:0;color:#fff;font-size:13px;font-weight:700;background:linear-gradient(90deg,#FF6B35,#FF4D2D)}' +
      '.ab-empty{text-align:center;padding:36px 0;color:#94A3B8;font-size:12px}';
    document.head.appendChild(st);
  }

  function pick(opts) {
    opts = opts || {};
    injectStyle();
    var l = list();
    var cur = opts.currentId || (getDefault() || {}).id;

    var mask = document.getElementById('abMask');
    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'abMask';
      document.body.appendChild(mask);
      mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    }

    var rows = l.map(function (a) {
      return '<div class="ab-item' + (String(a.id) === String(cur) ? ' sel' : '') + '" data-id="' + a.id + '">'
        + '<div class="ab-top"><span class="ab-nm">' + a.name + '</span><span class="ab-ph">' + a.phone + '</span>'
        + (a.isDefault ? '<span class="ab-tg">默认</span>' : (a.tag ? '<span class="ab-tg">' + a.tag + '</span>' : ''))
        + '</div>'
        + '<div class="ab-ft"><i class="fas fa-location-dot"></i><p>' + a.full + '</p></div>'
        + '<span class="ab-ic"><i class="fas fa-check"></i></span>'
        + '</div>';
    }).join('');

    mask.innerHTML = '<div id="abSheet">'
      + '<div class="ab-head"><b>' + (opts.title || '选择收货地址') + '</b><span class="ab-mng" id="abMng">管理地址 ›</span></div>'
      + '<div class="ab-list" id="abList">' + (rows || '<div class="ab-empty">还没有收货地址，先添加一个吧</div>') + '</div>'
      + '<div class="ab-foot"><button id="abOk">' + (rows ? '使用此地址' : '去添加地址') + '</button></div>'
      + '</div>';

    mask.classList.add('on');

    var chosen = cur;

    mask.querySelectorAll('.ab-item').forEach(function (el) {
      el.addEventListener('click', function () {
        chosen = el.getAttribute('data-id');
        mask.querySelectorAll('.ab-item').forEach(function (x) { x.classList.remove('sel'); });
        el.classList.add('sel');
      });
    });

    mask.querySelector('#abMng').onclick = function () {
      close();
      location.href = opts.manageHref || 'address.html';
    };

    mask.querySelector('#abOk').onclick = function () {
      if (!rows) { close(); location.href = opts.manageHref || 'address.html'; return; }
      var a = null;
      list().forEach(function (x) { if (String(x.id) === String(chosen)) a = x; });
      if (a && opts.remember === true) setDefault(a.id);
      close();
      if (a && typeof opts.onPick === 'function') opts.onPick(a);
    };

    function close() { mask.classList.remove('on'); }
  }

  window.AddrBook = {
    KEY: KEY,
    list: list,
    save: save,
    getDefault: getDefault,
    setDefault: setDefault,
    pick: pick,
    text: text,
    full: full
  };
})();
