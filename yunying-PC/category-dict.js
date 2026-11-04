/* ============================================================
   经营品类字典（唯一来源）
   维护入口：04 实体商户管理 → 品类字典（merchant-category.html）
   引用方：商户档案（merchant-profile）、商户端认证/资料变更、展商主营品类
   说明：真实系统是一张品类表；原型用本文件模拟，避免各页面各写一套选项。
   规则：只停用不删除；停用项不进新选择项，历史数据保留。
   ============================================================ */
window.CAT_DICT = [
  { id: 'CT-001', name: '男袜',        group: '袜品',     sort: 1, on: 1, note: '' },
  { id: 'CT-002', name: '女袜',        group: '袜品',     sort: 2, on: 1, note: '' },
  { id: 'CT-003', name: '童袜',        group: '袜品',     sort: 3, on: 1, note: '' },
  { id: 'CT-004', name: '运动袜',      group: '袜品',     sort: 4, on: 1, note: '' },
  { id: 'CT-005', name: '船袜',        group: '袜品',     sort: 5, on: 1, note: '' },
  { id: 'CT-006', name: '保暖袜',      group: '袜品',     sort: 6, on: 1, note: '' },
  { id: 'CT-007', name: '丝袜/打底裤', group: '袜品',     sort: 7, on: 1, note: '' },
  { id: 'CT-008', name: '棉袜',        group: '袜品',     sort: 8, on: 1, note: '' },
  /* 原料市场六大品类（2026-11-03 业务确认，与买家端原料市场对外叫法逐字一致；原「棉纱 / 氨纶包覆纱」并入后停用） */
  { id: 'CT-015', name: '纱线',        group: '原料纱线', sort: 1, on: 1, note: '' },
  { id: 'CT-016', name: '化纤长丝',    group: '原料纱线', sort: 2, on: 1, note: '' },
  { id: 'CT-017', name: '染料助剂',    group: '原料纱线', sort: 3, on: 1, note: '' },
  { id: 'CT-018', name: '辅料橡筋',    group: '原料纱线', sort: 4, on: 1, note: '' },
  { id: 'CT-019', name: '包装物料',    group: '原料纱线', sort: 5, on: 1, note: '物料类，区别于「设计包装」服务' },
  { id: 'CT-020', name: '纺机配件',    group: '原料纱线', sort: 6, on: 1, note: '' },
  { id: 'CT-009', name: '棉纱',        group: '原料纱线', sort: 9, on: 0, note: '2026-11 起由「纱线」替代，历史商户数据保留' },
  { id: 'CT-010', name: '氨纶包覆纱',  group: '原料纱线', sort: 10, on: 0, note: '2026-11 起归入「纱线」' },
  { id: 'CT-011', name: '袜机',        group: '袜机设备', sort: 1, on: 1, note: '' },
  { id: 'CT-012', name: '缝头机',      group: '袜机设备', sort: 2, on: 0, note: '2026-08 起无商户使用，暂时停用' },
  { id: 'CT-013', name: '包装设计',    group: '设计包装', sort: 1, on: 1, note: '' },
  { id: 'CT-014', name: '其他',        group: '其他',     sort: 1, on: 1, note: '兜底项，不允许停用' }
];
