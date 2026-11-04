/* ============================================================
   物业管理 · mock 数据层（原型演示，localStorage 持久化）
   对应 PRD：S08 §4 数据流 / §6 状态机
   说明：真实系统里单据主权在后台 07，本文件只做端上演示数据。
   ============================================================ */

/* ---------- 物业人员档案（业务属性，账号来自统一用户体系） ---------- */
var WUYE_STAFF = {
  name: '张建国',
  phone: '138****6621',
  posts: ['维修工', '巡检员'],
  area: 'A 栋 1-3F',
  leader: '王海涛',
  onDuty: true
};
var WUYE_MGR = {
  name: '王海涛',
  phone: '139****3088',
  posts: ['主管'],
  area: '全部区域',
  leader: '—',
  onDuty: true
};
function wuyeMe() { return wuyeIsManager() ? WUYE_MGR : WUYE_STAFF; }

/* ---------- 状态色板 ---------- */
var WW_STC = {
  '待受理': 'text-amber-600 bg-amber-50',
  '已派单': 'text-blue-600 bg-blue-50',
  '处理中': 'text-blue-600 bg-blue-50',
  '待采购': 'text-purple-600 bg-purple-50',
  '待确认': 'text-orange-600 bg-orange-50',
  '已完成': 'text-green-600 bg-green-50',
  '已驳回': 'text-gray-500 bg-gray-100',
  '待执行': 'text-amber-600 bg-amber-50',
  '执行中': 'text-blue-600 bg-blue-50',
  '逾期': 'text-red-600 bg-red-50',
  '待检': 'text-gray-500 bg-gray-100',
  '正常': 'text-green-600 bg-green-50',
  '异常': 'text-red-600 bg-red-50',
  '待处理': 'text-amber-600 bg-amber-50',
  '待判定': 'text-orange-600 bg-orange-50',
  '已转报修': 'text-blue-600 bg-blue-50',
  '待派发': 'text-amber-600 bg-amber-50',
  '整改中': 'text-blue-600 bg-blue-50',
  '待复核': 'text-purple-600 bg-purple-50',
  '已通过': 'text-green-600 bg-green-50',
  '已退回': 'text-orange-600 bg-orange-50',
  '已解决': 'text-green-600 bg-green-50',
  '已关闭': 'text-gray-500 bg-gray-100',
  '已回复': 'text-green-600 bg-green-50',
  '已升级': 'text-red-600 bg-red-50'
};
function stc(s) { return WW_STC[s] || 'text-gray-500 bg-gray-100'; }

/* ---------- 种子数据 ---------- */
function wuyeSeed() {
  return {
    /* ---------- 报修 BX ---------- */
    bx: [
      {
        no: 'BX202610-0042', unit: 'A3-118', area: 'A 栋 3F', type: '空调',
        desc: '空调不制冷，出风口有异响，已持续两天', urg: '一般', state: '处理中',
        worker: '张建国', createdAt: '2026-10-30 08:20', acceptAt: '2026-10-30 08:40',
        arriveAt: '2026-10-30 09:05', arriveGeo: '大唐袜业城 A 栋 3F 东侧（精度 8m）',
        photoBefore: true, resultDesc: '', photoAfter: 0, needMat: null, matNote: '',
        rating: 0, merchant: '李老板',
        logs: [['2026-10-30 08:20', '商户端提交报修（照片 1 张）'],
          ['2026-10-30 08:40', '王海涛 受理并派单 → 张建国，预计 09:30 到场'],
          ['2026-10-30 09:05', '张建国 到场打卡（移动端 · 定位 A 栋 3F 东侧）']]
      },
      {
        no: 'BX202610-0041', unit: 'B2-067', area: 'B 栋 2F', type: '水电',
        desc: '洗手池下水管漏水，地面已积水约 2 平米', urg: '紧急', state: '待受理',
        worker: '', createdAt: '2026-10-30 07:55', acceptAt: '', arriveAt: '', arriveGeo: '',
        photoBefore: true, resultDesc: '', photoAfter: 0, needMat: null, matNote: '',
        rating: 0, merchant: '陈老板',
        logs: [['2026-10-30 07:55', '商户端提交报修（照片 2 张）· 紧急']]
      },
      {
        no: 'BX202610-0039', unit: 'A1-012', area: 'A 栋 1F', type: '照明',
        desc: '通道顶灯 3 盏不亮，夜间通行看不清', urg: '一般', state: '已派单',
        worker: '张建国', createdAt: '2026-10-29 16:10', acceptAt: '2026-10-29 16:30',
        arriveAt: '', arriveGeo: '', photoBefore: true, resultDesc: '', photoAfter: 0,
        needMat: null, matNote: '', rating: 0, merchant: '周老板',
        logs: [['2026-10-29 16:10', '商户端提交报修（照片 1 张）'],
          ['2026-10-29 16:30', '王海涛 受理并派单 → 张建国，预计 10-30 09:00 到场']]
      },
      {
        no: 'BX202610-0036', unit: 'A2-045', area: 'A 栋 2F', type: '门窗',
        desc: '卷帘门卡住，无法完全关闭，商户已下班无法锁门', urg: '一般', state: '待确认',
        worker: '张建国', createdAt: '2026-10-29 09:30', acceptAt: '2026-10-29 09:45',
        arriveAt: '2026-10-29 10:20', arriveGeo: '大唐袜业城 A 栋 2F',
        photoBefore: true, resultDesc: '卷帘门导轨变形，已校正并加注润滑油，开关顺畅', photoAfter: 2,
        needMat: false, matNote: '', rating: 0, merchant: '吴老板',
        logs: [['2026-10-29 09:30', '商户端提交报修（照片 1 张）'],
          ['2026-10-29 09:45', '王海涛 受理并派单 → 张建国'],
          ['2026-10-29 10:20', '张建国 到场打卡（移动端）'],
          ['2026-10-29 11:40', '提交处理结果（处理后照片 2 张，无需物料）→ 待商户确认']]
      },
      {
        no: 'BX202610-0033', unit: 'C1-003', area: 'C 栋 1F', type: '地砖',
        desc: '地砖起拱 5 块，边缘翘起有绊倒风险', urg: '紧急', state: '待采购',
        worker: '张建国', createdAt: '2026-10-28 14:10', acceptAt: '2026-10-28 14:25',
        arriveAt: '2026-10-28 15:00', arriveGeo: '大唐袜业城 C 栋 1F',
        photoBefore: true, resultDesc: '已临时围挡，需更换同规格地砖', photoAfter: 1,
        needMat: true, matNote: '需 600×600 防滑地砖 5 块、水泥 1 包', rating: 0, merchant: '郑老板',
        logs: [['2026-10-28 14:10', '商户端提交报修（照片 1 张）· 紧急'],
          ['2026-10-28 14:25', '王海涛 受理并派单 → 张建国'],
          ['2026-10-28 15:00', '张建国 到场打卡（移动端）'],
          ['2026-10-28 16:20', '提交处理结果：需物料 → 待采购池（物料需求：地砖 5 块）']]
      },
      {
        no: 'BX202610-0028', unit: 'A3-101', area: 'A 栋 3F', type: '其他',
        desc: '商户自装灯箱脱落，悬挂在门头有坠落风险', urg: '一般', state: '已完成',
        worker: '张建国', createdAt: '2026-10-27 10:05', acceptAt: '2026-10-27 10:20',
        arriveAt: '2026-10-27 10:45', arriveGeo: '大唐袜业城 A 栋 3F',
        photoBefore: true, resultDesc: '灯箱已拆除，告知商户自行加装需报批', photoAfter: 2,
        needMat: false, matNote: '', rating: 5, merchant: '李老板',
        logs: [['2026-10-27 10:05', '商户端提交报修（照片 1 张）'],
          ['2026-10-27 10:20', '王海涛 受理并派单 → 张建国'],
          ['2026-10-27 10:45', '张建国 到场打卡（移动端）'],
          ['2026-10-27 11:30', '提交处理结果（处理后照片 2 张）'],
          ['2026-10-27 14:00', '商户确认完成，评价 5 星（响应快、修得好）']]
      }
    ],

    /* ---------- 巡检 XJ（含点位与检查项） ---------- */
    xj: [
      {
        no: 'XJ202610-0118', name: 'A 栋日常巡检', area: 'A 栋 1-3F',
        plan: '今日 09:00-11:00', state: '执行中', startedAt: '2026-10-30 09:12',
        startGeo: '大唐袜业城 A 栋 1F 中庭（精度 6m）',
        points: [
          {
            id: 'A1-01', name: 'A 栋 1F 南侧消防通道', type: '消防通道', status: '正常',
            items: [{ n: '通道是否堆放杂物', r: '正常' }, { n: '防火门是否锁闭', r: '正常' }, { n: '应急灯是否正常', r: '正常' }]
          },
          {
            id: 'A1-02', name: 'A 栋 1F 中庭灭火器组', type: '灭火器', status: '异常',
            items: [{ n: '压力表是否正常', r: '正常' }, { n: '是否在有效期内', r: '异常', note: '2 号灭火器有效期 2026-09，已过期', photo: 1 }, { n: '是否被遮挡', r: '正常' }]
          },
          {
            id: 'A2-02', name: 'A 栋 2F 通道堆物', type: '通道堆物', status: '正常',
            items: [{ n: '是否占道', r: '正常' }, { n: '是否超出黄线', r: '正常' }]
          },
          { id: 'A2-01', name: 'A 栋 2F 公共卫生间', type: '公共卫生间', status: '待检', items: [{ n: '地面是否积水', r: '待检' }, { n: '洁具是否完好', r: '待检' }, { n: '有无异味', r: '待检' }] },
          { id: 'A3-01', name: 'A 栋 3F 东侧消防通道', type: '消防通道', status: '待检', items: [{ n: '通道是否堆放杂物', r: '待检' }, { n: '防火门是否锁闭', r: '待检' }, { n: '应急灯是否正常', r: '待检' }] },
          { id: 'A3-02', name: 'A 栋 3F 北侧灭火器组', type: '灭火器', status: '待检', items: [{ n: '压力表是否正常', r: '待检' }, { n: '是否在有效期内', r: '待检' }, { n: '是否被遮挡', r: '待检' }] },
          { id: 'A3-03', name: 'A 栋 3F 西侧配电箱', type: '配电箱', status: '待检', items: [{ n: '箱门是否关闭', r: '待检' }, { n: '是否堆放物品', r: '待检' }, { n: '有无异味', r: '待检' }] },
          { id: 'A1-03', name: 'A 栋 1F 应急照明', type: '消防通道', status: '待检', items: [{ n: '应急灯是否正常', r: '待检' }, { n: '疏散指示是否清晰', r: '待检' }] }
        ]
      },
      {
        no: 'XJ202610-0119', name: 'B 栋日常巡检', area: 'B 栋 1-2F',
        plan: '今日 14:00-16:00', state: '待执行', startedAt: '', startGeo: '',
        points: [
          { id: 'B1-01', name: 'B 栋 1F 消防通道', type: '消防通道', status: '待检', items: [{ n: '通道是否堆放杂物', r: '待检' }, { n: '防火门是否锁闭', r: '待检' }] },
          { id: 'B1-02', name: 'B 栋 1F 灭火器组', type: '灭火器', status: '待检', items: [{ n: '压力表是否正常', r: '待检' }, { n: '是否在有效期内', r: '待检' }] },
          { id: 'B2-01', name: 'B 栋 2F 公共卫生间', type: '公共卫生间', status: '待检', items: [{ n: '地面是否积水', r: '待检' }, { n: '有无异味', r: '待检' }] },
          { id: 'B2-02', name: 'B 栋 2F 配电箱', type: '配电箱', status: '待检', items: [{ n: '箱门是否关闭', r: '待检' }, { n: '有无异味', r: '待检' }] },
          { id: 'B2-03', name: 'B 栋 2F 通道堆物', type: '通道堆物', status: '待检', items: [{ n: '是否占道', r: '待检' }, { n: '是否超出黄线', r: '待检' }] },
          { id: 'B1-03', name: 'B 栋 1F 应急照明', type: '消防通道', status: '待检', items: [{ n: '应急灯是否正常', r: '待检' }] }
        ]
      },
      {
        no: 'XJ202610-0110', name: 'A 栋日常巡检', area: 'A 栋 1-3F',
        plan: '10-29 09:00-11:00', state: '已完成', startedAt: '2026-10-29 09:05',
        startGeo: '大唐袜业城 A 栋 1F 中庭（精度 5m）',
        points: [
          { id: 'A1-01', name: 'A 栋 1F 南侧消防通道', type: '消防通道', status: '正常', items: [{ n: '通道是否堆放杂物', r: '正常' }] },
          { id: 'A1-02', name: 'A 栋 1F 中庭灭火器组', type: '灭火器', status: '正常', items: [{ n: '压力表是否正常', r: '正常' }] },
          { id: 'A2-01', name: 'A 栋 2F 公共卫生间', type: '公共卫生间', status: '异常', items: [{ n: '地面是否积水', r: '异常', note: '地漏堵塞积水', photo: 2 }] },
          { id: 'A2-02', name: 'A 栋 2F 通道堆物', type: '通道堆物', status: '异常', items: [{ n: '是否占道', r: '异常', note: '货架超出黄线约 0.6m', photo: 1 }] },
          { id: 'A3-01', name: 'A 栋 3F 东侧消防通道', type: '消防通道', status: '正常', items: [{ n: '通道是否堆放杂物', r: '正常' }] },
          { id: 'A3-02', name: 'A 栋 3F 北侧灭火器组', type: '灭火器', status: '正常', items: [{ n: '压力表是否正常', r: '正常' }] },
          { id: 'A3-03', name: 'A 栋 3F 西侧配电箱', type: '配电箱', status: '正常', items: [{ n: '箱门是否关闭', r: '正常' }] },
          { id: 'A1-03', name: 'A 栋 1F 应急照明', type: '消防通道', status: '正常', items: [{ n: '应急灯是否正常', r: '正常' }] }
        ]
      },
      {
        no: 'XJ202610-0102', name: 'C 栋日常巡检', area: 'C 栋 1-2F',
        plan: '10-27 09:00-11:00', state: '逾期', startedAt: '', startGeo: '',
        points: [
          { id: 'C1-01', name: 'C 栋 1F 消防通道', type: '消防通道', status: '待检', items: [{ n: '通道是否堆放杂物', r: '待检' }] },
          { id: 'C1-02', name: 'C 栋 1F 灭火器组', type: '灭火器', status: '待检', items: [{ n: '压力表是否正常', r: '待检' }] },
          { id: 'C2-01', name: 'C 栋 2F 配电箱', type: '配电箱', status: '待检', items: [{ n: '箱门是否关闭', r: '待检' }] }
        ]
      }
    ],

    /* ---------- 问题 WT（v1.5：3 态 待处理 / 已转报修 / 已关闭；责任方仅归因） ---------- */
    wt: [
      {
        no: 'WT202610-0068', area: 'A 栋 3F 东侧消防通道', type: '消防', sev: '严重',
        desc: '通道堆放纸箱约 1.5m 宽，无法通行，消防栓被遮挡', owner: '商户责任',
        state: '待处理', reporter: '张建国', at: '2026-10-30 09:50', photos: 2,
        from: '随手报问题', unit: 'A3-118', bxNo: '', result: null,
        logs: [['2026-10-30 09:50', '张建国 移动端上报（照片 2 张）· 责任方=商户责任 · 待物业处置']]
      },
      {
        no: 'WT202610-0067', area: 'B 栋 2F 洗手间外', type: '卫生', sev: '一般',
        desc: '地面油污积水约 3 平米，商户门口滑倒风险', owner: '商户责任',
        state: '已关闭', reporter: '张建国', at: '2026-10-28 15:20', photos: 1,
        from: '随手报问题', unit: 'B2-067', bxNo: '',
        result: { desc: '已现场清理油污并加装 1.2m×3m 防滑垫，要求商户每日收摊后冲洗地面', photos: 2, by: '王海涛', at: '2026-10-29 10:05' },
        logs: [['2026-10-28 15:20', '张建国 移动端上报（照片 1 张）'],
          ['2026-10-28 16:00', '物业现场核实，通知商户配合'],
          ['2026-10-29 10:05', '提交处理结果（照片 2 张）→ 已关闭']]
      },
      {
        no: 'WT202610-0066', area: 'A 栋 1F 中庭', type: '设备', sev: '轻微',
        desc: '中庭顶灯闪烁，影响商户营业与顾客体验', owner: '物业责任',
        state: '已转报修', reporter: '张建国', at: '2026-10-30 08:30', photos: 1,
        from: '随手报问题', unit: '公共区域', bxNo: 'BX202610-0041', result: null,
        logs: [['2026-10-30 08:30', '张建国 移动端上报（照片 1 张）· 责任方=物业责任'],
          ['2026-10-30 08:50', '物业判断需维修 → 转报修 BX202610-0041（原记录保留）']]
      },
      {
        no: 'WT202610-0065', area: 'A 栋 2F 通道', type: '占道', sev: '一般',
        desc: '货架超出黄线约 0.6m，影响推车通行', owner: '物业责任',
        state: '待处理', reporter: '商户（本档口）', at: '2026-10-29 10:40', photos: 1,
        from: '商户端反馈', unit: 'A2-045', bxNo: '', result: null,
        logs: [['2026-10-29 10:40', '商户端反馈（照片 1 张）· 责任方=物业责任 · 待物业处置']]
      },
      {
        no: 'WT202610-0060', area: 'C 栋 1F', type: '安全', sev: '严重',
        desc: '电瓶车在通道内充电，存在消防隐患', owner: '商户责任',
        state: '已关闭', reporter: '张建国', at: '2026-10-26 11:20', photos: 1,
        from: '随手报问题', unit: 'C1-003', bxNo: '',
        result: { desc: '已现场劝阻并移除充电车辆，告知商户至集中充电区充电', photos: 1, by: '王海涛', at: '2026-10-26 13:00' },
        logs: [['2026-10-26 11:20', '张建国 上报'],
          ['2026-10-26 13:00', '提交处理结果（照片 1 张）→ 已关闭']]
      }
    ],

    /* ---------- 整改 ZG ---------- */
    zg: [
      {
        no: 'ZG202610-0035', wt: 'WT202610-0067', unit: 'B2-067', area: 'B 栋 2F',
        req: '清洗地面油污并加装防滑垫，整改后拍照上报', deadline: '2026-10-31',
        state: '待复核', rejectTimes: 0, over: 0, createdAt: '2026-10-28 16:00',
        submit: { desc: '已清洗地面油污，加装 1.2m×3m 防滑垫', photos: 2, at: '2026-10-30 09:20' },
        rejectWhy: '', before: 1,
        logs: [['2026-10-28 16:00', '王海涛 派发整改（限期 10-31）'],
          ['2026-10-30 09:20', '商户提交整改（说明 + 照片 2 张）→ 待复核']]
      },
      {
        no: 'ZG202610-0034', wt: 'WT202610-0062', unit: 'A2-045', area: 'A 栋 2F',
        req: '撤除占道货架，货物移至店内经营区域', deadline: '2026-10-30',
        state: '整改中', rejectTimes: 0, over: 1, createdAt: '2026-10-27 09:40',
        submit: null, rejectWhy: '', before: 1,
        logs: [['2026-10-27 09:40', '王海涛 派发整改（限期 10-30）'],
          ['2026-10-30 10:00', '超期未提交，已提醒商户并抄送主管']]
      },
      {
        no: 'ZG202610-0031', wt: 'WT202610-0058', unit: 'A1-012', area: 'A 栋 1F',
        req: '清空消防通道内全部货品，保持 1.2m 净宽', deadline: '2026-10-28',
        state: '已退回', rejectTimes: 1, over: 0, createdAt: '2026-10-25 10:10',
        submit: { desc: '已搬走部分纸箱', photos: 1, at: '2026-10-27 16:40' },
        rejectWhy: '通道深处仍有 6 个纸箱未清，净宽不足 0.5m，请彻底清理后重拍', before: 1,
        logs: [['2026-10-25 10:10', '王海涛 派发整改（限期 10-28）'],
          ['2026-10-27 16:40', '商户提交整改（照片 1 张）'],
          ['2026-10-27 17:20', '王海涛 退回（第 1 次）：通道深处仍有纸箱未清']]
      },
      {
        no: 'ZG202610-0029', wt: 'WT202610-0060', unit: 'C1-003', area: 'C 栋 1F',
        req: '清理门前垃圾并每日定时清倒', deadline: '2026-10-26',
        state: '已通过', rejectTimes: 0, over: 0, createdAt: '2026-10-26 13:00',
        submit: { desc: '已清运垃圾，安排每日 17:00 清倒', photos: 2, at: '2026-10-26 16:30' },
        rejectWhy: '', before: 1,
        logs: [['2026-10-26 13:00', '王海涛 派发整改'],
          ['2026-10-26 16:30', '商户提交整改（照片 2 张）'],
          ['2026-10-26 17:20', '王海涛 移动端复核通过 → 已通过关闭']]
      }
    ],

    /* ---------- 投诉 TS ---------- */
    ts: [
      {
        no: 'TS202610-0021', src: '商户端', who: '李老板（A3-118）', phone: '138****1188',
        target: '物业人员', cat: '维修质量', state: '待受理', over: false,
        desc: '报修空调两天没人来处理，打电话也没人接，影响正常营业', photos: 1,
        at: '2026-10-30 08:05', reply: '', replyBy: '', rating: 0,
        logs: [['2026-10-30 08:05', '商户端提交投诉（分类：维修质量）']]
      },
      {
        no: 'TS202610-0020', src: '电话代录', who: '王女士', phone: '137****2210',
        target: '公共区域', cat: '秩序问题', state: '处理中', over: true,
        desc: 'B 栋 2F 通道堆货严重，推车过不去，反映多次没人管', photos: 1,
        at: '2026-10-29 14:20', reply: '', replyBy: '', rating: 0,
        logs: [['2026-10-29 14:20', '物业 王海涛 电话代录（来电号 137****2210）'],
          ['2026-10-29 15:00', '受理 → 指派 张建国 处理']]
      },
      {
        no: 'TS202610-0018', src: '商户端', who: '陈老板（B2-067）', phone: '139****6620',
        target: '商户', cat: '经营纠纷', state: '已回复', over: false,
        desc: '隔壁商户每天早晚装卸货噪音很大，影响营业', photos: 0,
        at: '2026-10-28 10:30',
        reply: '已与 A2-046 商户沟通，装卸货调整至 08:30 后、17:00 前，并加装减震垫，本周内完成。',
        replyBy: '王海涛', rating: 0,
        logs: [['2026-10-28 10:30', '商户端提交投诉'],
          ['2026-10-28 11:00', '受理 → 指派 王海涛'],
          ['2026-10-29 09:30', '已回复（现场协调 + 整改承诺）']]
      },
      {
        no: 'TS202610-0015', src: '巡检转', who: '张建国', phone: '138****6621',
        target: '公共区域', cat: '设施问题', state: '已关闭', over: false,
        desc: 'A 栋 2F 卫生间地漏堵塞积水，顾客反馈滑倒', photos: 2,
        at: '2026-10-26 09:10', reply: '已疏通地漏并更换防滑地垫，当日 16:00 完成。',
        replyBy: '王海涛', rating: 5,
        logs: [['2026-10-26 09:10', '巡检发现问题转入投诉'],
          ['2026-10-26 09:30', '受理'],
          ['2026-10-26 16:10', '已回复'],
          ['2026-10-26 18:00', '商户评价 5 星 → 已关闭']]
      }
    ],

    /* ---------- 我的工作量 ---------- */
    stat: { todayDone: 4, todayAccept: 6, monthDone: 58, monthRate: 96, avgResp: '38 分钟', xjRate: 92, xjDone: 42, xjTotal: 46 }
  };
}

function wuyeDB() {
  try {
    var s = localStorage.getItem(WUYE_DB_KEY);
    if (s) return JSON.parse(s);
  } catch (e) { }
  var d = wuyeSeed();
  localStorage.setItem(WUYE_DB_KEY, JSON.stringify(d));
  return d;
}
function wuyeSave(db) { localStorage.setItem(WUYE_DB_KEY, JSON.stringify(db)); }
function wuyeReset() {
  localStorage.removeItem(WUYE_DB_KEY);
  location.reload();
}

/* ---------- 通用工具 ---------- */
var _toastTimer;
function toast(m) {
  var t = document.getElementById('toast');
  if (!t) { alert(m); return; }
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2400);
}
function openSheet(id) { var e = document.getElementById(id); if (e) e.classList.add('on'); }
function closeSheet(id) { var e = document.getElementById(id); if (e) e.classList.remove('on'); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
function nowStr() {
  var d = new Date();
  function p(n) { return n < 10 ? '0' + n : '' + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
/* 模拟定位：原型里给固定坐标文案；fail=true 模拟定位失败 */
function wuyeGeo(fail) {
  if (fail) return null;
  return '大唐袜业城 A 栋 3F 东侧（经度 120.2418，纬度 29.7132，精度 7m）';
}
