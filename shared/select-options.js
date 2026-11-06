/* ===========================================================
   shared/select-options.js —— 筛选下拉选项与列表数据保持一致
   背景：物业 7 页的筛选 <option> 长期写死，注入数据 / 跨页转单 /
   模块下线残留值不会回流，出现「下拉有但列表没有」「列表有但下拉没有」。

   用法：SEL_OPTS.fill(id, rows, field, allLabel, opt)
     - field: 字段名或取值函数；值可为字符串或数组（posts[] / cat[] 自动展开）
     - opt.order  : 期望排序（不在表内的排在后面）
     - opt.label(v) / opt.value(v): 自定义 option 文本与 value
     - opt.exclude: 排除值；opt.extra: 追加值
     - 返回选项数量；保留当前选中值（若仍有效），否则回到「全部」

   调用时机：每页主 render() 末尾，数据一变下拉自动跟着变。
   =========================================================== */
(function (g) {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function values(rows, field, opt) {
    opt = opt || {};
    var out = [], seen = {}, exclude = opt.exclude || [];
    (rows || []).forEach(function (r) {
      var v = typeof field === 'function' ? field(r) : r[field];
      (Array.isArray(v) ? v : [v]).forEach(function (x) {
        if (x == null) return;
        x = String(x).trim();
        if (!x || seen[x] || exclude.indexOf(x) > -1) return;
        seen[x] = 1; out.push(x);
      });
    });
    if (opt.order && opt.order.length) {
      out.sort(function (a, b) {
        var ia = opt.order.indexOf(a), ib = opt.order.indexOf(b);
        return (ia < 0 ? 9999 : ia) - (ib < 0 ? 9999 : ib);
      });
    }
    (opt.extra || []).forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); });
    return out;
  }
  function fill(id, rows, field, allLabel, opt) {
    var el = document.getElementById(id);
    if (!el) return 0;
    opt = opt || {};
    var vals = values(rows, field, opt), cur = el.value;
    var valOf = opt.value || function (v) { return v; };
    var txtOf = opt.label || function (v) { return v; };
    el.innerHTML = (opt.noAll ? '' : '<option value="">' + esc(allLabel || '全部') + '</option>')
      + vals.map(function (v) {
        return '<option value="' + esc(valOf(v)) + '">' + esc(txtOf(v)) + '</option>';
      }).join('');
    var valid = vals.map(valOf);
    if (cur && valid.indexOf(cur) > -1) el.value = cur;
    else el.value = (opt.defaultFirst && valid.length) ? valid[0] : '';
    return vals.length;
  }
  g.SEL_OPTS = { values: values, fill: fill };
})(window);
