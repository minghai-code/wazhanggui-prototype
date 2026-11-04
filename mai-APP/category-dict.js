/* ============================================================
   经营品类字典（买家端镜像 · 仅供原型演示）
   唯一来源：04 实体商户管理 → 品类字典（yunying-PC/merchant-category.html）
   数据文件：yunying-PC/category-dict.js（本文件内容与其保持一致）
   规则：只取 on=1 的启用项；停用项不进新选项，历史值照常展示。
   真实系统里由接口下发，端上不再各写一套。
   ============================================================ */
window.CAT_DICT = [
  { id: 'CT-001', name: '男袜',        group: '袜品',     sort: 1, on: 1 },
  { id: 'CT-002', name: '女袜',        group: '袜品',     sort: 2, on: 1 },
  { id: 'CT-003', name: '童袜',        group: '袜品',     sort: 3, on: 1 },
  { id: 'CT-004', name: '运动袜',      group: '袜品',     sort: 4, on: 1 },
  { id: 'CT-005', name: '船袜',        group: '袜品',     sort: 5, on: 1 },
  { id: 'CT-006', name: '保暖袜',      group: '袜品',     sort: 6, on: 1 },
  { id: 'CT-007', name: '丝袜/打底裤', group: '袜品',     sort: 7, on: 1 },
  { id: 'CT-008', name: '棉袜',        group: '袜品',     sort: 8, on: 1 },
  { id: 'CT-009', name: '棉纱',        group: '原料纱线', sort: 1, on: 1 },
  { id: 'CT-010', name: '氨纶包覆纱',  group: '原料纱线', sort: 2, on: 1 },
  { id: 'CT-011', name: '袜机',        group: '袜机设备', sort: 1, on: 1 },
  { id: 'CT-012', name: '缝头机',      group: '袜机设备', sort: 2, on: 0 },
  { id: 'CT-013', name: '包装设计',    group: '设计包装', sort: 1, on: 1 },
  { id: 'CT-014', name: '其他',        group: '其他',     sort: 1, on: 1 }
];
