/* ============================================================
   07 物业服务 ↔ 商户端 端间演示同步（Y-19 B-0；v2 增服务预约 Y-22）
   借用 localStorage 让原型演示「商户端提交 → 后台受理 → 商户端回显」闭环，
   不是前后端同步架构。四类单据：
     报修 sh_bx_v2 / 投诉 sh_ts / 问题反馈 wuye_db_v2.wt / 服务预约 sh_booking
   unit 语义统一 = 上报档口（单据归属），回写时只改业务状态，不丢 unit。
   缴费仍未接入（归口待 PM 确认，勿凭空建页）。
   ============================================================ */
(function (g) {
  var K = { repair: 'sh_bx_v2', complaint: 'sh_ts', issue: 'wuye_db_v2', booking: 'sh_booking' };
  var DEF_UNITS = ['1F-A08', '2F-B12', 'YLSC-S08', 'XZFW-3F-06'];

  function ls(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function units() {
    if (g.WUYE_UNITS && g.WUYE_UNITS.length) {
      return g.WUYE_UNITS.map(function (u) { return u.code; });
    }
    return DEF_UNITS.slice();
  }

  function raw(kind) {
    if (kind === 'issue') {
      var db = ls(K.issue);
      return (db && Array.isArray(db.wt)) ? db.wt : [];
    }
    var a = ls(K[kind]);
    return Array.isArray(a) ? a : [];
  }

  function toRow(kind, o) {
    if (!o || !o.no) return null;
    if (kind === 'repair') return {
      no: o.no, src: '商户端', reporter: o.unit || '商户端', pl: '', b: '', f: '',
      unit: o.unit || '', addr: o.addr || '', type: o.type || '其他', desc: o.desc || '',
      urg: o.urg || '一般', state: o.state || '待受理', hours: 0, photos: o.photos || 0,
      doubt: false, createdAt: o.createdAt || '', expect: '', logs: o.logs || [],
      acceptBy: o.acceptBy || '', worker: o.worker || '', arriveAt: o.arriveAt || '',
      resultDesc: o.resultDesc || '', rejectWhy: o.rejectWhy || '', star: o.star || 0,
      fromApp: true
    };
    if (kind === 'complaint') return {
      no: o.no, src: '商户端', by: o.unit || '商户端', phone: '', obj: o.obj || '',
      cat: o.cat || '', desc: o.desc || '', photos: o.photos || 0,
      state: o.state || '待受理', over: 0, acceptBy: '', handler: o.handler || '',
      reply: o.reply || '', replyAt: o.replyAt || '', star: o.star || 0,
      tags: o.tags || [], cmt: o.cmt || '', bxNo: o.bxNo || '', zgNo: o.zgNo || '',
      createdAt: o.createdAt || '', logs: o.logs || [], unit: o.unit || '', fromApp: true
    };
    if (kind === 'booking') return {
      no: o.no, src: '商户端', reporter: o.reporter || '商户端', phone: o.phone || '',
      unit: o.unit || '', type: o.type || '保洁', name: o.name || o.desc || o.type + '服务',
      time: o.time || '', state: o.state || '待确认',
      worker: o.worker || '', planAt: o.planAt || '', arriveAt: o.arriveAt || '',
      finishAt: o.finishAt || '', resultDesc: o.resultDesc || '',
      fee: o.fee || '', feeNote: o.feeNote || '', feeSettled: o.feeSettled || false,
      star: o.star || 0, comment: o.comment || '', cancelWhy: o.cancelWhy || '',
      exceptionWhy: o.exceptionWhy || '', exceptionNote: o.exceptionNote || '',
      exceptionAt: o.exceptionAt || '', exceptionGeo: o.exceptionGeo || '',
      exceptionPhotos: o.exceptionPhotos || 0,
      createdAt: o.createdAt || '', logs: o.logs || [], fromApp: true
    };
    return {
      no: o.no, area: o.area || o.unit || '', unit: o.unit || '', type: o.type || '',
      desc: o.desc || '', photos: o.photos || 0, duty: o.owner || '商户责任',
      level: o.sev || '一般', by: o.reporter || '商户端', from: o.from || '商户端反馈',
      state: o.state || '待处理', days: 0, deadline: '', createdAt: o.at || '',
      logs: o.logs || [], bxNo: o.bxNo || '', fromApp: true
    };
  }

  function inject(kind, rows) {
    var seen = {};
    rows.forEach(function (r) { seen[r.no] = 1; });
    var n = 0;
    raw(kind).forEach(function (o) {
      if (!o || !o.no || seen[o.no]) return;
      var r = toRow(kind, o);
      if (!r) return;
      rows.unshift(r); seen[r.no] = 1; n++;
    });
    return n;
  }

  function unitList(rows) {
    var out = [], seen = {};
    units().forEach(function (u) { if (!seen[u]) { seen[u] = 1; out.push(u); } });
    (rows || []).forEach(function (r) {
      if (r.unit && !seen[r.unit]) { seen[r.unit] = 1; out.push(r.unit); }
    });
    return out;
  }

  function back(kind, row) {
    var src = raw(kind), hit = null;
    src.forEach(function (o) { if (o.no === row.no) hit = o; });
    if (!hit) return false;
    hit.state = row.state;
    var extra = kind === 'repair'
      ? ['acceptBy', 'worker', 'arriveAt', 'resultDesc', 'rejectWhy', 'star']
      : (kind === 'complaint'
        ? ['handler', 'reply', 'replyAt', 'star', 'bxNo', 'zgNo']
        : (kind === 'booking'
          ? ['worker', 'planAt', 'arriveAt', 'finishAt', 'resultDesc', 'fee', 'feeNote', 'feeSettled', 'star', 'comment', 'cancelWhy',
             'exceptionWhy', 'exceptionNote', 'exceptionAt', 'exceptionGeo', 'exceptionPhotos']
          : ['bxNo', 'result']));
    extra.forEach(function (k) {
      if (row[k] != null && row[k] !== '') hit[k] = row[k];
    });
    if (kind === 'issue') {
      var db = ls(K.issue) || {};
      db.wt = src;
      save(K.issue, db);
    } else {
      save(K[kind], src);
    }
    return true;
  }

  function backAll(kind, rows) {
    var n = 0;
    rows.forEach(function (r) { if (r.fromApp && back(kind, r)) n++; });
    return n;
  }

  function all() {
    return { repair: raw('repair'), complaint: raw('complaint'), issue: raw('issue') };
  }

  g.WUYE_SYNC = {
    K: K, units: units, raw: raw, toRow: toRow, inject: inject,
    unitList: unitList, back: back, backAll: backAll, all: all
  };
})(window);
