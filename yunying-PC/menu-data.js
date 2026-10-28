/* =============================================================================
 * menu-data.js —— 运营管理端侧边栏「唯一数据源」
 * -----------------------------------------------------------------------------
 * 【重要】全项目只有这一处定义菜单。任何页面（含 iframe 子页面）禁止再写导航 DOM。
 * 修改菜单必须遵循 SOP：
 *   1. 先改 开发PRD/运营管理端PRD.md 的菜单树
 *   2. 再改本文件
 *   3. 递增 MENU_VERSION
 *   4. 运行 check-menu.ps1 自检，报告为空才算完成
 *
 * 【书写规范 - 自检脚本依赖，请勿破坏】
 *   - 每个菜单项必须写在同一行内（包含 name / page / status / points）
 *   - page 为已有原型文件名；page 为 null 表示「开发中」，渲染时自动指向 developing.html
 *   - status: 'done' = 已有原型（page 必须有值）；'dev' = 开发中（page 必须为 null）
 *   - status: 'ext' = 外采原样（由外采系统承载，无原型页，page 必须为 null，check-menu 放行）
 *   - points: 规划要点数组，取自《功能架构（完整版）》三级功能点，用于占位页展示
 *
 * 【顺序】数组顺序 = 侧边栏展示顺序，调整顺序即移动数组元素，勿复制粘贴
 * ========================================================================== */

window.MENU_VERSION = '2026.10.28-02';
window.MENU_UPDATED = '2026-10-28';

window.MENU_DATA = [

/* ---------------------------------------------------------------- 01 运营总览 */
{
  id: '01-overview', name: '运营总览', icon: 'fa-gauge-high', open: true,
  children: [
    { type: 'item', name: '四流指标总览', page: 'dashboard.html', status: 'done', points: ['人流', '物流', '资金流', '信息流'] },
    { type: 'item', name: '产业专题分析', page: null, status: 'dev', points: ['人流专题', '资金流专题', '信息流专题', '物流专题', '产业专题', '智慧物业专题'] },
    { type: 'item', name: '生意概览', page: null, status: 'dev', points: ['今日交易', '集采订单', '询盘转化'] },
    { type: 'item', name: '工作台', page: null, status: 'dev', points: ['待办事项', '告警中心（任务分配）', '缴费催收', '快捷入口'] }
  ]
},

/* ---------------------------------------------------------- 02 市场资源管理 */
{
  id: '02-resource', name: '市场资源管理', icon: 'fa-building', open: false,
  children: [
    { type: 'item', name: '楼栋楼层管理', page: 'resource-building.html', status: 'done' },
    { type: 'item', name: '摊位商铺管理', page: 'resource-unit.html', status: 'done' },
    { type: 'item', name: '平面图维护', page: 'resource-floorplan.html', status: 'done' },
    { type: 'item', name: '资源状态看板', page: 'resource-dashboard.html', status: 'done' }
  ]
},

/* ---------------------------------------------------------- 03 智慧物联管理 */
{
  id: '03-iot', name: '智慧物联管理', icon: 'fa-microchip', open: false,
  children: [
    { type: 'item', name: '物联设备管理', page: null, status: 'dev', points: ['设备台账', '设备状态', '接入配置'] },
    { type: 'item', name: '告警中心', page: null, status: 'dev', points: ['告警列表', '告警规则', '处理流转'] }
  ]
},

/* -------------------------------------------------------------- 04 商户管理 */
{
  id: '04-merchant', name: '实体商户管理', icon: 'fa-store', open: false,
  children: [
    { type: 'item', name: '线下自动建档与同步', page: 'merchant-auto.html', status: 'done', points: ['触发源：05 合同「已存档」事件 + 每日兜底同步', '按姓名+身份证自动建档（身份不全时降级建档）', '建档字段：企业类型 / 档口 / 租期 / 合同号 / 物业权限标记', '自动建档异常清单与处理'] },
    { type: 'item', name: '资料变更审核', page: 'merchant-change.html', status: 'done', points: ['变更类型：企业信息/联系方式/资质/经营类目（档口关联变更由 05 驱动）', '申请列表', '通过/驳回（原因必填）', '主档回写留痕'] },
    { type: 'item', name: '商户档案', page: 'merchant-profile.html', status: 'done', points: ['只含实体（档口）商户：线上兼档口 / 仅线下档口（未上线）——纯线上商户归 10 商城运营', '列表列：商户类型 / 关联档口 / 授权员工数 / 物业权限；行内「添加员工」（关联账号 → 物业模块，权限随合同期；v2.7 文案统一「员工 / 档口使用人 / 关联账号」，禁用「转租 / 分租 / 租客」）', '详情 ⑧ 物业权限与关联账号（关联台账 + 解除关联留痕）', '详情 ⑨ 历史租赁信息（v2.8）：同一档案跨合同 / 跨档口 —— 已结束租赁的 历史档口 / 历史合同（合同号 · 租期 · 年租金 · 结束原因）/ 当时的店铺信息；来源 05 合同终态归档（+ 每日兜底），只读；同一档口可多条（以合同号区分）；空态提示「暂无历史租赁记录（首次租赁）」', '详情/编辑/画像标签/操作留痕；档案由 05 合同「已存档」自动生成'] },
    { type: 'item', name: '信用评级', page: 'merchant-rating.html', status: 'done', points: ['信用指标规则配置（交易/评价/缴费，版本化不回溯）', '多源自动评分（缴费无源时标"数据缺失"）', '商户评级列表', '评级详情与人工调整留痕'] },
    { type: 'item', name: '资质与到期管理', page: 'merchant-qual.html', status: 'done', points: ['资质台账（营业执照/生产许可/品牌授权/质检报告）；只含实体（档口）商户', '定位：不再作为报价前置门槛（随线上开店审核默认开通电商与报价权限）', '证书到期复核（过期 → 自动冻结报价）+ 受限场景校验（品牌授权类/大额/需质检报告）', '到期提醒与商户重传'] },
    { type: 'item', name: '租金催缴', page: 'merchant-dunning.html', status: 'done', points: ['每年 8 月 15 日起自动催缴第二年租金；规则全部可配置（催缴期 / 频率 / 时段 / 逾期升级 / 渠道 / 文案）', '应收额来自 05 合同应收计划；渠道 = 站内 + 微信（短信可选 · 独立短信服务）', '执行记录：期次 / 应收·已缴·未缴 / 通知次数 / 结果 + 人工补发 + 暂停该户', '发送前校验核销状态；「已缴 / 缴纳状态」由财务在本模块人工登记（06 缴费管理本期不做）', 'v2.6 新增「缴纳名单导入」：运营每天手动导入一个【累计更新的 Excel】（当前催缴阶段已缴租金商户名单）→ 系统发送前比对，已缴商户不再收到催缴短信 / 站内 / 微信通知；含模板下载 / 预校验（命中·未缴足·未匹配）/ 导入批次记录 / 整批撤销'] },
    { type: 'item', name: '清退商户', page: 'merchant-exit.html', status: 'done', points: ['被终止合同商户的【存档台账】（只读）；终止由 05 合同台账发起（终止生效日 + 原因 + 主管确认）', '列表：合同号 / 档口 / 终止类型 / 终止生效日 / 终止原因 / 操作人 / 联动结果', '详情 = 合同侧终止时间轴留痕（可追溯为什么被终止）：提交终止 → 主管确认 → 合同已终止 → 02 档口当前租户清空并回空闲 → 04 商户状态按原因置「违约终止（违约）/ 已终止（非违约）」→ 物业权限与关联账号回收', '只收「提前终止」记录；正常合同到期 ≠ 终止——到期由系统自动置「已到期」（无审批/无原因），不进本页台账', '待办结果只读；不含保证金处理与线上店铺（保证金线下必缴已收；线上网店归 10 商城运营）'] }
  ]
},

/* -------------------------------------------------------------- 05 合同管理 */
{
  id: '05-contract', name: '合同管理', icon: 'fa-file-contract', open: false,
  children: [
    { type: 'item', name: '合同模板管理', page: 'contract-template.html', status: 'done', points: ['模板按资源类型拆分：档口（精品 5 年 / 普通 3 年）/ 办公室 / 店面 / 物业（办公室与店面必须不同模板）', '版本化 + 启停（回滚生成新版本）', '变量占位（承租人 / 资源编号 / 租期起止 / 年租金 / 企业类型；v1.6 去掉保证金变量）→ 合同专员生成合同时自动填充', '正文口径：手写签名（无人脸识别）· 到期重新竞拍 · 终止不计算违约金'] },
    { type: 'item', name: '合同台账与签署留档', page: 'contract-list.html', status: 'done', points: ['合同台账（客户台账 21 字段 + 主体信息组【v1.8：主体类型〔个人 / 企业〕/ 承租方名称〔姓名或企业名称〕/ 统一社会信用代码 / 身份证号 / 法定代表人·联系人 / 联系电话 / 企业类型】；v1.6 不含保证金）', '「录入合同」+「批量导入」（存量逐条录入；整批校验通过才入库）', '操作「终止」（仅未到期在租合同可见；v1.7：终止 = 提前终止 ≠ 到期）：终止生效日 + 原因字典（7 项）+ 主管确认 → 合同「已终止」+ 02 档口「当前租户」清空并回「空闲（待竞拍）」+ 04 商户状态按原因置「违约终止（违约）/ 已终止（非违约）」+ 物业权限与关联账号回收', 'T-90/60/30 到期标记（红/黄）+「仅看到期·逾期」筛选（自到期预警页并入）', '详情：合同生成与签署留档（短信 / 手写签名 / 签署审核 / 盖章件）+ 应收计划（只读；核销登记在 04 租金催缴）'] },
    { type: 'item', name: '合同变更审核', page: 'contract-change.html', status: 'done', points: ['变更类型（v1.9 六类）：租金 / 租期 / 面积 / 承租人 / 主体信息变更（新增：主体类型切换 / 企业名称 / 统一社会信用代码 / 法定代表人·联系人 / 联系电话 / 企业类型）/ 摊位号（拆「终止 + 新签」）', '承租方按主体类型显示（企业主体 = 企业名称 + 联系人）；前后对比含「主体信息组」+ 变更原因 + 附件 + 下游影响预览', '下游影响预览含：04 档案主体同步 + 签署匹配键（联系电话变更 → 签署手机号同步；合同在签署中则改绑重签）+ 重签要求（变更补充协议）', '敏感标记（租金 / 租期 / 承租人 / 主体信息 = 需主管审批）+「需重签变更补充协议」标记；审批（合同号不变，生成新版本）→ 回写留痕 + 重推 02 / 06 / 04', '企业主体变更校验：企业名称 / 统一社会信用代码（18 位且不与其他在租企业重复）/ 法定代表人·联系人 / 联系电话 必填 + 工商变更证明'] },
    { type: 'item', name: '合同发起与签署', page: 'contract-apply.html', status: 'done', points: ['v1.8 主体分「个人 / 企业」：企业主体须填 企业名称 / 统一社会信用代码 / 法定代表人·联系人 / 联系电话（签署匹配键）/ 企业类型；个人主体填 姓名 / 身份证号 / 手机号', 'Tab1「竞拍结果与发起」：人工录入 + 批量导入竞拍结果（手机号必填；办公室无竞拍可留空）→ 生成合同（模板按资源类型 + 变量自动填充）并发送 + 自动发短信（生成与发送为同一动作，取消独立「待生成」）', 'Tab2「签署与盖章」：只处理 待商户签字 → 待签署审核 → 已存档·生效中 / 已撤回（盖章件待回传 / 已回传）；重发短信（仅催办，内容与版本不变）/ 改绑手机号 / 撤回（v1.10：原因必填 → 合同退回「待发起」，改内容后由 Tab1 重新发起 v+1、合同号不变；签署单留「已撤回 · 待重新发起」）/ 审核签字 / 上传盖章件', 'Tab3「短信发送记录」：留痕 + 重发（模板占位、文案待定）', '联系人用同一手机号注册 → 商户端出现待签合同 → 手写签名（无人脸识别）→ 合同专员审核签字 → 生效存档'] }
  ]
},

/* -------------------------------------------------------------- 06 缴费管理 */
{
  id: '06-payment', name: '缴费管理', icon: 'fa-money-check-dollar', open: false,
  children: [
    { type: 'item', name: '账单缴费', page: null, status: 'dev', points: ['账单类型', '待缴费账单（催缴提醒）', '已缴费账单'] },
    { type: 'item', name: '计费规则配置', page: null, status: 'dev', points: ['租金计费规则', '电费计费规则（物联网数据统计）'] },
    { type: 'item', name: '对账管理', page: null, status: 'dev', points: ['对账单', '差异处理'] },
    { type: 'item', name: '发票管理', page: null, status: 'dev', points: ['发票申请', '开票记录'] }
  ]
},

/* -------------------------------------------------------------- 07 物业服务 */
{
  id: '07-property', name: '物业服务', icon: 'fa-screwdriver-wrench', open: false,
  children: [
    { type: 'group', name: '报修与维修资金', items: [
      { type: 'item', name: '报修工单', page: 'property-repair.html', status: 'done', points: ['7 态：待受理/已派单/处理中/待采购/待确认/已完成/已驳回', '现场照片必传（水印：时间·位置·单号；EXIF 早于提交 >24h 标凭证存疑）', '受理派单（指定维修工 + 预计到场，超 2 小时未受理提醒主管）', '提交处理结果：处理说明 + 处理后照片；需物料 → 进待采购池，本单不关闭', '待确认：商户确认或 3 天自动确认'] },
      { type: 'item', name: '交办单与核销', page: 'property-request.html', status: 'done', points: ['3 Tab：待采购池 / 交办单 / 核销异常台账', '审批链按金额自动分档：<1000 元 2 级；≥1000 元 4 级（市场管理部→市场部负责人→分管领导→董事长）', '新建单：关联报修 + 物资明细 + 预申请金额（须等于明细合计）+ 比价单 ≥2 家', '逐行核销：勾选物资行 + 发票信息 + 实时校验，分次上传', '硬拦：要素不全 / 未勾行 / 发票号重复；标异常：数量超核 / 单价超 10% / 金额超审批 / 换供应商', '异常台账必须处置（接受说明 / 要求补正 / 追回差额）'] },
      { type: 'item', name: '维修资金台账', page: 'property-budget.html', status: 'done', points: ['额度看板 5 卡：年度总额度 / 已核销 / 在途 / 剩余（<20% 橙、<0 红）/ 额外追加', '只有核销成功计入已核销，审批通过只算在途；周期 9.1–8.31 跨期不结转', '月度消耗柱状 + 结构分析（类别 TOP10 / 供应商 TOP5 / 楼栋）', '待核销清单（停留 >15 天标久悬）', '额外申请：金额 + 用途 ≥10 字 + 依据；审批串行 运营主管 → 财务，通过后追加额度', '历史采购导入：整批回滚 + 失败行清单；写入历史成交价库，不影响额度'] },
      { type: 'item', name: '维修风控看板', page: null, status: 'dev', points: ['三期规划', '风险总览 / 命中规则分布（7 条规则）/ 异常趋势 / AI 复盘建议 / 异常单清单', '规则引擎：价格偏离 R1 / 比价不足 R2 / 凭证存疑 R3 / 高频报修 R4 / 金额拆分 R5 / 供应商集中 R6 / 额度挤压 R7', 'AI 只给建议，决策权在人；人工覆写须填理由'] }
    ]},
    { type: 'group', name: '现场治理', items: [
      { type: 'item', name: '巡检管理', page: 'property-inspect.html', status: 'done', points: ['2 Tab：巡检计划 / 巡检任务（轻量版：只配区域与频次，不配点位与检查项）', '计划：名称 / 区域多选 / 频次 / 时段 / 巡检员多人轮值 / 启停；启用后每日自动生成任务', '任务 4 态：待执行 → 执行中（定位打卡）→ 已完成；超计划时间未开始 → 逾期', '执行中可多次上报问题（跳问题上报，区域自动带入）；完成任务不强制有问题'] },
      { type: 'item', name: '问题上报', page: 'property-issue.html', status: 'done', points: ['9 列 + 7 Tab；现场照片必传（≥1 张）', '按责任方分流：商户责任 → 派整改（ZG）；物业责任 → 转报修（BX，带原照片与位置）', '待判定 → 主管判定责任方后才能分流；待判定超 3 天提醒', '转报修后原记录保留（不删除），改判责任方需留痕，已生成单不撤销', '关闭原因必填（重复 / 无效 / 已自行处理）'] },
      { type: 'item', name: '整改管理', page: 'property-rectify.html', status: 'done', points: ['4 Tab：待派发 / 整改中 / 待复核 / 已关闭（合并原「整改派发 + 整改复核」两页）', '派发：整改商户 + 整改要求 ≥5 字 + 限期（不早于当日）+ 通知方式（站内/短信）', '商户提交：整改说明 ≥5 字 + 整改后照片 ≥1 张（无照片不能提交）', '复核必显：原问题照片 vs 整改后照片并排对比', '通过关闭 → 关联问题转已解决；退回原因必填 + 超期天数重置；退回 3 次升级主管', '支持批量通过（留痕：操作人与批次）'] }
    ]},
    { type: 'item', name: '投诉建议', page: 'property-complaint.html', status: 'done', points: ['5 态：待受理 → 处理中 → 已回复 → 已关闭；旁路 已升级', '来源：商户端 / 买家端 / 电话代录（必填来电号）/ 巡检转', '24h 未受理自动升级；3 工作日未回复升级运营主管；满意度 ≤3 星自动回访', '转单反哺：维修质量 → 转报修（BX）；秩序问题 → 转整改（ZG）；原投诉保留', '关闭条件：已回复且已评价'] },
    { type: 'item', name: '保洁管理', page: null, status: 'dev', points: ['本期只定义，不做原型', '结构与巡检/问题/整改同构：保洁计划（区域+频次+保洁员）→ 任务 → 执行 → 不达标上报', '检查项示例：地面清洁 / 垃圾桶清运 / 卫生间耗材 / 异味 / 积水', '不达标可转整改（商户门前）或转报修（设施损坏）'] }
  ]
},

/* -------------------------------------------------------------- 08 活动运营 */
{
  id: '08-activity', name: '商户活动运营', icon: 'fa-calendar-check', open: false,
  children: [
    { type: 'item', name: '活动列表', page: 'activity.html', status: 'done', points: ['10 态派生（草稿/待审批/已驳回/未开始/报名中/待开始/进行中/已结束/已取消/已下架）', '筛选：类型/状态/主办方/时间；统计卡 4 项', '上下架（上架才在**商户端「物业服务→活动参与」**可见）· 复制新建 · 取消（主管权限，通知全部报名商户）· 删除（仅草稿）', '报名进度（已占位/名额）与行内跳报名/签到'] },
    { type: 'item', name: '活动创建', page: 'activity-create.html', status: 'done', points: ['四段式：基本信息 → 时间与地点 → 报名设置 → 签到与投放', '校验：时间倒挂（报名截止 ≤ 活动开始 < 活动结束）、名额不得小于已报名、绝对化用语拦截', '报名字段配置（姓名/手机固定必填；单位/职务/备注可选）与同行人数上限', '签到窗（默认开始前 60 分钟 ~ 结束后 60 分钟）；**展示位固定**（商户端物业服务→活动参与），不设投放位选择', '保存草稿 / 提交发布（平台免审，商户走审批）；类型不含「文旅活动」（归 14 文商旅管理）'] },
    { type: 'item', name: '活动审批', page: 'activity-approve.html', status: 'done', points: ['商户活动待审队列（待审批/已通过/已驳回）', '系统预检：时间合法、名额合理、地点联系人齐全、绝对化用语', '通过并上架（**商户端「活动参与」立即可见** + 通知商户）', '驳回（原因枚举 + 具体说明必填，商户可改后重提，编号不变版本 +1）'] },
    { type: 'item', name: '报名管理', page: 'activity-signup.html', status: 'done', points: ['**跨活动全局列表**：活动名称独立列（含活动编号小字）', '活动筛选为**可搜索下拉**（输入即时过滤、显示各活动条数、含「全部活动」）', '筛选：关键词 · 审核状态 · 签到状态 · 来源 · 提交时间；摘要条随范围变', '审核：单条 / 批量通过、驳回（原因）、取消（释放名额）', '批量导入（模板 5 列 → 粘贴 → 逐行校验 → 成功/失败明细，来源=导入）', '现场补录（**必选活动**，来源=现场，直接置已签到，超名额二次确认，同手机号拦截）', '手机号脱敏；查看完整需填原因并留痕；导出脱敏 Excel（不含签到码）+ 留痕；0 条时禁用导出'] },
    { type: 'item', name: '签到管理', page: 'activity-checkin.html', status: 'done', points: ['**跨活动全局列表**：活动名称独立列 + 编号', '活动筛选可搜索；状态 / 签到方式（扫码·手工）/ 签到时间 / 关键词', '核销台：**必须先指定活动**，未选禁用并提示；6 位码 / 扫码；窗口外禁用', '反馈四态：成功 / 已签到（幂等）/ 活动不匹配 / 无效码', '手工核销 · 撤销核销（原因）· 标记爽约 · 导出签到表', '签到进度随筛选范围切换（本场 / 全局）'] }
  ],
  refs: ['activity-detail.html']
},

/* -------------------------------------------------------------- 09 内容管理 */
{
  id: '09-content', name: '内容管理', icon: 'fa-newspaper', open: false,
  children: [
    { type: 'item', name: '资讯文章', page: 'content.html', status: 'done', points: ['资讯文章列表（分类 / 状态 / 投放端筛选）', '编辑抽屉（富文本 + 封面）+ 各端预览', '多端投放位 + 定时上下线', '端上：买家端首页资讯瀑布流 + 资讯详情页'] },
    { type: 'item', name: '公告通知', page: 'content-notice.html', status: 'done', points: ['通知对象（全平台 / 仅买家 / 仅商户）+ 置顶显著提示', '有效期 + 定时发布 + 类别筛选与关键词搜索', '可选「同步推送消息」（生成推送任务）', '端上：买家端消息中心 / 商户端通知公告 + 工作台'] },
    { type: 'item', name: 'Banner管理', page: 'content-banner.html', status: 'done', points: ['投放位（端 × 页面 × 位次）+ 排序与展示优先级', '点击行为 + 生效期 + 排期视图 + 各端预览', '按位曝光统计（投标 4.2.1.4.5）', '活动审批通过 → 曝光位草稿（招标 #105）'] },
    { type: 'item', name: '产业指数发布', page: 'content-index.html', status: 'done', points: ['简化版：客户线下每年发布 → 只做录入 / 导入（不做自动计算与图表生成）', '指数类型：原料价格 / 景气 / 创新 / 趋势（可只填实际发布的类型）、一年一期', '年度期次 + 数值 + 单位 + 较上期（人工）+ 口径说明（必填）+ 附件（客户发布稿）+ 定时发布', '台账按年度回溯；端上消费位待确认（买家端行情参考 / 驾驶舱）'] },
    { type: 'item', name: '消息推送', page: 'content-push.html', status: 'done', points: ['消息模板（触发条件 / 目标人群 / 渠道 / 频次限制 / 变量占位）', '渠道 = 站内推送 + 微信消息推送（H5 挂公众号）；短信暂不开通', '推送记录：送达 / 失败 / 已读未读统计 + 失败原因分布', '人工补发；与「公告通知」联动（公告可勾选同步推送，生成推送任务）'] }
  ]
},

/* -------------------------------------------------------------- 10 商城运营 */
{
  id: '10-mall', name: '商城运营', icon: 'fa-shop', open: false,
  children: [
    { type: 'group', name: '店铺管理', items: [
      { type: 'item', name: '店铺列表', page: 'mall-shop-list.html', status: 'done', points: ['对齐外采 igshop', '新增/编辑店铺（名称/LOGO/所属商户）', '店铺类型：普通店铺/品牌店铺（品牌馆展示）/自营店铺'] },
      { type: 'item', name: '店铺设置', page: 'mall-shop-setting.html', status: 'done', points: ['对齐外采 igshop', '商品审核开关（商品默认审核通过）', '推荐商品数量/最大管理员数', '自营店铺展示名称'] }
    ]},
    { type: 'group', name: '商户管理', items: [
      { type: 'item', name: '入驻申请', page: 'mall-merchant-apply.html', status: 'done', points: ['对齐外采 igshop', '状态筛选：全部/待审核/审核通过/审核未通过', '审核通过/驳回（通知申请人）'] },
      { type: 'item', name: '商户列表', page: 'mall-merchant-list.html', status: 'done', points: ['对齐外采 igshop', '商户档案（企业认证/个人认证）', '已绑定店铺数/认证状态', '添加/编辑/删除'] },
      { type: 'item', name: '商户设置', page: 'mall-merchant-setting.html', status: 'done', points: ['对齐外采 igshop', '允许个人入驻/入驻需审核', '单商户最大店铺数量', '入驻协议内容（富文本）'] },
      { type: 'item', name: '招商内容', page: 'mall-merchant-recruit.html', status: 'done', points: ['对齐外采 igshop', '招商Banner/合作模式/流程图', '招商计划/招商标准/入驻流程', '同步买家端招商页'] }
    ]},
    { type: 'group', name: '商品管理', items: [
      { type: 'item', name: '商品列表', page: 'mall-ops.html', status: 'done', points: ['袜品', 'AI自动审核', '上下架管控'] },
      { type: 'item', name: '新增商品', page: 'mall-product-add.html', status: 'done', points: ['对齐外采 igshop', '商品字段/规格/SKU', '提交后进入审核'] }
    ]},
    { type: 'item', name: '视频管理', page: null, status: 'dev', points: ['商家视频上传', '下架'] },
    { type: 'item', name: '采购询价需求管理', page: 'mall-inquiry.html', status: 'done', points: ['需求列表（发布人/需求详情/竞价人/竞价详情）', '成交人及关联订单', '违规下架/关闭'] },
    { type: 'item', name: '个性定制需求管理', page: 'mall-custom-demand.html', status: 'done', points: ['需求列表（三种类型：仅打样/直接大货/先打样后大货）', '竞价详情', '关联定制订单'] },
    { type: 'group', name: '订单管理', items: [
      { type: 'item', name: '普通订单', page: null, status: 'ext', points: ['外采 igshop 系统承载，无需改造，开发直接看外采系统'] },
      { type: 'item', name: '采购询价订单', page: 'mall-order-inquiry.html', status: 'done', points: ['可关联原始需求单', '字段对齐普通订单 + 询价个性化（需求溯源/成交报价/交期承诺）'] },
      { type: 'item', name: '拼单集采订单', page: 'mall-order-group.html', status: 'done', points: ['拼单发起人', '拼单参与人', '参团人明细（各人数量与实付）', '目标档位与成团时间', '详情可跳拼单活动'] },
      { type: 'item', name: '样品打样订单', page: 'mall-order-sample.html', status: 'done', points: ['可关联原始需求单', '可关联定制主订单（先打样后大货）', '打样轮次与设计方案快照', '打样费抵扣额度与使用情况', '详情可跳关联定制单'] },
      { type: 'item', name: '定制订单', page: 'mall-order-custom.html', status: 'done', points: ['个性小批量（可关联需求单）', '企业大批量（可关联需求单和打样单）', '打样费抵扣立减（须标注"打样费抵扣"）', '详情可跳关联打样单'] }
    ]},
    { type: 'item', name: '营销运营', page: null, status: 'dev', points: ['团购活动', '秒杀活动', '新品发售', '尾货专区', '细分主题'] },
    { type: 'item', name: '热搜词管理', page: 'trend-data.html', status: 'done', points: ['关键词热度列表', '置顶', '隐藏'] },
    { type: 'item', name: '推荐位管理', page: 'mall-recommend.html', status: 'done', points: ['线下商场商铺推荐位（2026-10-09 业务确认：推荐位 = 推荐线下商铺，归本模块）', '与 09 内容管理的「平台级内容位」分界：两处不得改同一前端位（两套位字典分表）', '端上落点：买家端线下市场「市场布局图」下方「实力商家」橱窗（2026-10-26 确认）', '同位次同时段唯一；商铺清退自动下线'] },
    { type: 'item', name: '趋势榜单管理', page: 'trend-ranking.html', status: 'done', points: ['榜单类型', '榜单列表（配置/详情）'] },
    { type: 'item', name: '财务资金管理', page: null, status: 'dev', points: ['对账管理', '结算管理', '提现流水'] },
    { type: 'item', name: '商城报表', page: null, status: 'dev', points: ['销售报表', '商品报表', '活动报表', '客户报表'] }
  ]
},

/* --------------------------------------------------------- 11 原料市场管理 */
{
  id: '11-material', name: '原料市场管理', icon: 'fa-boxes-stacked', open: false,
  children: [
    { type: 'item', name: '基本信息', page: null, status: 'dev', points: ['市场介绍编辑'] },
    { type: 'item', name: '区域导览', page: null, status: 'dev', points: ['区域划分', '地图点位'] }
  ]
},

/* ---------------------------------------------------------- 12 AI工具运营 */
{
  id: '12-aitools', name: 'AI工具运营', icon: 'fa-robot', open: false,
  children: [
    { type: 'item', name: 'AI工具配置', page: 'ai-ops.html', status: 'done', points: ['工具列表', '配置', '下架'] },
    { type: 'item', name: '服务商管理', page: 'ai-provider.html', status: 'done', points: ['服务商名称', '配置', '详情'] },
    { type: 'item', name: '使用统计', page: 'ai-usage.html', status: 'done', points: ['工具列表', '统计分析'] },
    { type: 'item', name: '计费策略', page: 'ai-billing.html', status: 'done', points: ['新增', '策略列表（编辑/详情）'] }
  ]
},

/* ---------------------------------------------------------- 13 产业链服务 */
{
  id: '13-chain', name: '产业链服务', icon: 'fa-network-wired', open: false,
  children: [
    { type: 'group', name: '外贸服务', items: [
      { type: 'item', name: '独立站对接', page: null, status: 'dev', points: ['新建', '独立站列表（服务介绍配置/链接配置/移动端跳转）'] },
      { type: 'item', name: '跨境业务审批', page: null, status: 'dev', points: ['商家跨境业务需求', '企业资质审批'] },
      { type: 'item', name: '跨境服务管理', page: null, status: 'dev', points: ['新建', '三方服务列表（关/支付/物流/贸易服务商配置、诉求收集与流转）'] },
      { type: 'item', name: '知识培训', page: null, status: 'dev', points: ['新建', '课程列表'] }
    ]},
    { type: 'group', name: '金融服务', items: [
      { type: 'item', name: '服务商管理', page: 'chain-finance.html', status: 'done', points: ['机构与产品（16 字段：机构/机构类型/产品名/产品类型/额度/利率/期限/标签/适用对象/生效期/排序/状态/免责声明）', '第三方申请入口（H5 / 小程序 / 二维码 / 电话 / 线下网点，可配多条；URL 与电话格式校验、二维码必须有图）', '上架校验（入口≥1）+ 紧急下架（原因必填）+ 到期自动过期 + 排序号', '点击统计与入口抽检（只统计入口点击，不含企业身份与申请内容；失败阈值红标）', '明确不做：申请单 / 审批 / 放款 / 材料收集（ND-01～ND-05）'] }
    ]},
    { type: 'group', name: '人才招聘', items: [
      { type: 'item', name: '企业管理', page: 'chain-recruit-company.html', status: 'done', points: ['新增/编辑（企业名唯一校验；企业类型/信用代码/联系人/电话/地址/简介）', '关联入驻商户（搜索 04 档案 → 自动带出企业名/联系人/电话，只读不写 04）', '企业列表（岗位数可跳岗位管理 / 招聘记录 / 评价）', '停用/删除（有岗位不可删；停用后不可新建岗位）'] },
      { type: 'item', name: '岗位管理', page: 'chain-recruit-job.html', status: 'done', points: ['岗位列表（12 列 + 批量删除；筛选：发布时间/年度模式/工种/岗位/单位/状态）', '新建/编辑 15 字段（工种 21 项字典、单位二选一、薪资区间校验）', '状态机：待审核/招聘中/已驳回/已关闭；端上发布必审、运营代发免审', '关闭（原因必选）/重新上架（再审）/删除（仅已关闭且无投递）', '详情：基本信息 + 职位描述 + 审核记录 + 投递统计 + 报名信息跳转'] },
      { type: 'item', name: '简历管理', page: 'chain-recruit-resume.html', status: 'done', points: ['简历列表（11 列；姓名/电话/身份证后4位/婚姻/年限/投递状态筛选）', '详情（基本信息 + 简历详情 + 投递记录）', '身份证与手机号默认脱敏；查看完整需填原因并留痕', '导出（脱敏 Excel，二次确认 + 留痕）'] },
      { type: 'item', name: '投递管理', page: 'chain-recruit-delivery.html', status: 'done', points: ['投递记录（岗位/单位/求职者/状态/时间筛选；48h 未查看红标）', '详情：岗位摘要 + 简历快照（投递时点）+ 回复时间线', '首次打开自动置「已查看」并留痕', '回复：约面试（时间/地点）/ 不合适（原因枚举）+ 通知求职者'] },
      { type: 'item', name: '招聘审核', page: 'chain-recruit-audit.html', status: 'done', points: ['待审核列表（工种/岗位/单位/联系人模糊筛选；超 24h 红标升级但不自动通过）', '审核详情（只读 + 历史驳回原因 + 提交次数）', '通过 → 招聘中（端上展示并通知发布方）/ 驳回 → 原因枚举 + 说明必填', '误操作通过后 2 小时内且无投递可撤回审核'] },
      { type: 'item', name: '招聘指南', page: 'chain-recruit-guide.html', status: 'done', points: ['单篇富文本（标题 + 工具栏 + 编辑区；保存即生效）', '预置四分区：平台规则 / 如何写简历 / 面试注意 / 防骗提示', '端上预览（手机壳）+ 发布前自检（必须写明平台不收费）', '本期不做多篇与版本历史'] }
    ]},
    { type: 'group', name: '知识产权', items: [
      { type: 'item', name: '配置管理', page: 'chain-ip.html', status: 'done', points: ['新建/编辑配置（展示文案 + 跳转目标 + 电话/二维码）', '列表（服务类型：专利查询 / 商标注册 / 版权登记，与端上 Tab 一致）', '投放端（买家端/商户端）+ 排序 + 生效期 + 上下架', '端上预览 + 测试跳转 + 按配置统计点击量'] }
    ]},
    { type: 'group', name: '技术共享', items: [
      { type: 'item', name: '需求发布管理', page: 'chain-tech-demand.html', status: 'done', points: ['需求列表（技术领域 / 对接状态 / 发布状态 / 仅看超期未对接）', '发布即生效；来源端 = 商户端 / 买家端提交 + 运营代录（列表来源端标签，编辑只读）', '投放端（买家端+商户端 / 仅商户端），端上须按此过滤', '对接申请（v1.4 自助）：端上发起 → 系统揭示对方联系方式 → 双方线下自联 → 任一方回来反馈结果（已成交 / 未成交）；运营只做代录申请 / 异常关闭 / 代反馈，不录过程进展', '超期未对接 15 天红标；匹配成功时间 → 平均匹配时长 / 成功率（以对接单为准）'] },
      { type: 'item', name: '技术成果管理', page: 'chain-tech-achv.html', status: 'done', points: ['成果列表（高校/研究所成果：领域 / 成熟度 / 应用场景 / 合作方式）', '技术专家 Tab（端上「技术专家」区块数据源）', '对接申请（v1.4：成果被对接，不强制关联需求）：发起方信息 + 联系方式揭示留痕 + 结果反馈；运营代录与异常关闭', '成果附件（说明书/专利）与端口投放'] }
    ]},
    { type: 'group', name: '政策兑现', items: [
      { type: 'item', name: '政策发布', page: 'chain-policy.html', status: 'done', points: ['政策列表（分类：资金补贴 / 人才政策 / 创新支持，与端上 Tab 一致）', '结构化字段：申报条件 / 申报材料 / 兑现流程 / 申报起止 / 受理方式 + 原文附件', 'AI 图文解读（一键生成 → 人工复核终稿，发布前必填）', '申报受理 Tab：受理 / 退回补正 / 登记兑现 / 未通过，状态回写端上并推送'] }
    ]},
    { type: 'group', name: '中介服务', items: [
      { type: 'item', name: '服务发布管理', page: 'chain-agency.html', status: 'done', points: ['服务商台账（**服务商主数据产生方**）：类型 / 服务范围 / 资质 / 评分 / 上下架', '服务项目（内容 / 计费方式 / 价格 / 周期 / 跳转），可单独上下架', '评价明细（评分聚合来源 + 投诉处置留痕）与委托登记（撮合金额来源）', '类型：财务服务 / 法律咨询 / 管理咨询 / 认证检测 / 知识产权，与端上分类一致'] }
    ]}
  ]
},

/* ---------------------------------------------------------- 14 文商旅管理 */
{
  id: '14-travel', name: '文商旅管理', icon: 'fa-map-location-dot', open: false,
  children: [
    { type: 'item', name: '文旅资源管理', page: null, status: 'dev', points: ['新建', '资源列表（场所配置/地图落点/活动排期）'] },
    { type: 'item', name: '大唐文旅活动管理', page: null, status: 'dev', points: ['新建', '活动列表（详情/报名名单）'] },
    { type: 'group', name: '研学管理', items: [
      { type: 'item', name: '申请审批', page: 'study-approve.html', status: 'done', points: ['个人报名审批（推导）', '团体申请审批', '批量审核与通知'] },
      { type: 'item', name: '团体研学管理', page: 'study-group.html', status: 'done', points: ['未开始/进行中/已结束', '分享', '责任签署记录与催收', '签到记录', '评价审核'] },
      { type: 'item', name: '研学基地管理', page: 'study-base.html', status: 'done', points: ['新建', '基地列表（详情/编辑删除）', '经纬度打点'] },
      { type: 'item', name: '研学线路活动管理', page: 'study-route.html', status: 'done', points: ['路线库（新建/编辑/上下架）', '场次日历与名额', '报名名单', '签到记录', '评价'] },
      { type: 'item', name: '研学宣传配置', page: 'study-promo.html', status: 'done', points: ['专题 Banner', '课程体系', '师资力量', '研学成果与往期风采', '宣传视频'] },
      { type: 'item', name: '责任书模板管理', page: 'study-letter.html', status: 'done', points: ['个人版（7 条）', '团体版（5 条）', '条款编辑', '版本管理与存证说明'] }
    ]},
    { type: 'group', name: '袜博会', items: [
      { type: 'item', name: '袜博会列表', page: 'expo-list.html', status: 'done', points: ['创建新一届（空白配置）', '复制模板：已归档届次一键生成新届次草稿（结构性配置带过来，展位状态重置为可选，价格标待复核）', '配置 = 唯一编辑入口（基本信息 / 展会介绍 / 展位管理 / 展示管理 4 个 Tab），「编辑」已合并', '展示管理：从参展商名录勾选上首页展商 + 排序，不再手填（原「精选展商」）', '每 Tab 独立保存，保存后同步买家端'] },
      { type: 'item', name: '展位申请管理', page: 'expo-booth.html', status: 'done', points: ['待审批 / 已通过 / 已驳回', '展位由展商在买家端申请时自选', '审核通过即报名成功（参展商）并锁定展位，无需等缴费', '缴费走线下对公转账，此处只做「登记缴费」（金额/到账日期/凭证），不影响参展资格', '逾期未缴不自动取消，进催缴名单'] },
      { type: 'item', name: '参观申请管理', page: 'expo-visitor.html', status: 'done', points: ['待审批', '已通过', '已驳回', '名单导出', '观众画像统计'] },
      { type: 'item', name: '参展商管理', page: 'expo-exhibitor.html', status: 'done', points: ['展商主数据（谁参展）：展商列表 / 详情 / 展位信息 / 企业资料状态', '资料审核不在本页：状态只读，「去审核」跳资料管理并带展商筛选（唯一审核台 = 资料管理）', '缴费状态（未缴费 / 已缴费）+「登记缴费」（线下到账，一笔可覆盖多个展位）', '「上首页」只读——由袜博会列表 → 配置 → 展示管理勾选排序，本页不再「设为精选」', '按公司维度催缴（欠费不影响参展资格）'] },
      { type: 'item', name: '日程安排管理', page: 'expo-schedule-manage.html', status: 'done', points: ['新建日程', '日程列表', '议程详情与嘉宾', '发布与变更通知'] },
      { type: 'item', name: '签到管理', page: 'expo-checkin.html', status: 'done', points: ['签到名单', '详情', '手工补签', '到场率统计'] },
      { type: 'item', name: '资料管理', page: 'expo-material.html', status: 'done', points: ['官方资料上传与策略', '展商资料审核（唯一审核台）：厂家介绍 / 商品名录 / 展位效果图 三类同队列', '支持 ?tab=m&exh=展商名 从参展商管理跳入并自动筛选 + 顶部筛选条', '驳回原因必填（≥2 字）；待审数（卡 / Tab 徽标 / 列表标题）同源联动', '下载量统计'] },
      { type: 'item', name: '往期存档回顾', page: 'expo-archive.html', status: 'done', points: ['每届信息聚合报告', '导出', '复制为新一届模板'] }
    ]}
  ]
},

/* -------------------------------------------------------------- 15 报表中心 */
{
  id: '15-report', name: '报表中心', icon: 'fa-chart-pie', open: false,
  children: [
    { type: 'item', name: '销售报表', page: null, status: 'dev', points: [] },
    { type: 'item', name: '商品报表', page: null, status: 'dev', points: [] },
    { type: 'item', name: '活动报表', page: null, status: 'dev', points: [] },
    { type: 'item', name: '客户报表', page: null, status: 'dev', points: [] },
    { type: 'item', name: '物业报表', page: null, status: 'dev', points: [] },
    { type: 'item', name: '采购节统计', page: null, status: 'dev', points: [] }
  ]
},

/* -------------------------------------------------------- 16 数据底座平台 */
{
  id: '16-dataplatform', name: '数据底座平台', icon: 'fa-database', open: false,
  children: [
    { type: 'group', name: '数据规划', items: [
      { type: 'item', name: '主题域管理', page: null, status: 'dev', points: ['产业基础资源', '原材料', '研发设计', '袜机专项设备', '智能制造生产', '智能质检', '仓储物流', '跨境外贸', '产业链服务商', '袜业文商旅'] },
      { type: 'item', name: '数据源图谱', page: null, status: 'dev', points: ['数据源分布', '权属与更新频率', '敏感等级'] },
      { type: 'item', name: '数据分级分类', page: null, status: 'dev', points: ['公开/共享/敏感/核心四级标注', '分级管理策略配置'] },
      { type: 'item', name: '场景需求映射', page: null, status: 'dev', points: ['业务场景数据需求清单', '数据集-服务-场景映射'] },
      { type: 'item', name: '数据资产目录规划', page: null, status: 'dev', points: [] },
      { type: 'item', name: '数据资产统计概览', page: 'data-asset-overview.html', status: 'done', points: ['统计期切换（今日/本周/本月/本年）· 数据截至时间 · 资产搜索 · 导出', '全域 KPI 六项（资产对象/记录总量/本期新增/环比/活跃/异常）', '9 个一级域卡片（3×3）：总量 · 本期新增 · 环比 · 7 天迷你趋势 · 资产数', '域下钻抽屉：二级域 → 资产行（总量/新增/环比/更新时间/跳明细）', '榜单：增长 Top5 · 体量 Top5', '异常提示：久未更新 / 环比跌 >30% / 采集失败（带原因）', '未接入清单：C 级与开发中资产，不计入统计，显示原因'] }
    ]},
    { type: 'group', name: '数据标准', items: [
      { type: 'item', name: '数据元标准管理', page: null, status: 'dev', points: ['数据元定义', '统一编码规则', '数据字典与元数据管理', '血缘自动解析'] },
      { type: 'item', name: '安全合规标准', page: null, status: 'dev', points: ['分类分级安全标准', '脱敏规则配置', '数据共享审批流程', '数据出境安全评估'] }
    ]},
    { type: 'group', name: '数据接入', items: [
      { type: 'item', name: '数据源管理', page: 'data-source.html', status: 'done', points: ['数据库接入', '文件接入', 'API接入', '云服务接入', '连接测试', '结构抽取与样本同步', '数据源列表与筛选'] },
      { type: 'item', name: '采集任务管理', page: 'data-industry.html', status: 'done', points: ['政务数据授权接入', '互联网公开数据合规采集', '第三方服务商数据填报'] },
      { type: 'item', name: '接入网关', page: 'data-monitor.html', status: 'done', points: ['通道鉴权', '流量控制', '监控告警'] }
    ]},
    { type: 'group', name: '数据入湖与分层', items: [
      { type: 'item', name: '入湖管理', page: null, status: 'dev', points: ['湖仓一体存储', '多协议接入', '元数据自动注册', '血缘关系生成'] },
      { type: 'item', name: '质量前置校验', page: null, status: 'dev', points: ['校验规则配置', '不合格拦截与告警'] },
      { type: 'item', name: '分层架构管理', page: null, status: 'dev', points: ['ODS原始层', 'DWD明细层', 'DWS汇总层', 'ADS应用层'] },
      { type: 'item', name: '应用数据集封装', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '数据治理', items: [
      { type: 'item', name: '质量监控与巡检', page: null, status: 'dev', points: ['完整性/准确性/一致性/及时性检测', '质量工单闭环'] },
      { type: 'item', name: '主数据管理', page: null, status: 'dev', points: ['企业主数据', '产品主数据', '原料主数据', '设备主数据'] },
      { type: 'item', name: 'AI数据治理', page: null, status: 'dev', points: ['表字段业务描述维护', 'AI自动生成字段描述', '枚举取值识别', '字段显隐控制', '场景数据表勾选', '字段定义导出', '企业文档统一管理'] },
      { type: 'item', name: '数据安全治理', page: null, status: 'dev', points: ['敏感字段自动脱敏', '存储传输加密', 'RBAC+数据分级权限', '审计日志与溯源'] }
    ]},
    { type: 'group', name: '清洗与挖掘', items: [
      { type: 'item', name: '清洗加工', page: null, status: 'dev', points: ['去重与异常值处理', '缺失值补全', '格式标准化', '跨源实体对齐'] },
      { type: 'item', name: '知识图谱', page: null, status: 'dev', points: ['图谱创建（自动/手动）', '构建进度与统计', '图谱卡片管理', '图谱检索', 'Agent/Workflow调用'] },
      { type: 'item', name: '数据仓库', page: null, status: 'dev', points: ['表描述（AI生成）', '字段管理', '枚举识别', '手动触发抽取', '问数数据表选择'] },
      { type: 'item', name: '数据挖掘', page: null, status: 'dev', points: ['多源融合挖掘分析', '特征挖掘与异常分析', '自定义规则与参数配置', '结果可视化与成果复用'] }
    ]},
    { type: 'group', name: '数据服务', items: [
      { type: 'item', name: '数据资产地图', page: null, status: 'dev', points: ['十大主题集群全貌', '数据量/质量/使用情况'] },
      { type: 'item', name: '数据集检索与详情', page: null, status: 'dev', points: ['全文/分类/标签检索', '数据字典/样本预览/质量报告'] },
      { type: 'item', name: '资产价值评估', page: null, status: 'dev', points: ['价值排行榜'] }
    ]}
  ]
},

/* --------------------------------------------------- 17 AI大模型智能体平台 */
{
  id: '17-aiplatform', name: 'AI大模型智能体平台', icon: 'fa-brain', open: false,
  children: [
    { type: 'group', name: '模型中心', items: [
      { type: 'item', name: '模型供应商管理', page: null, status: 'dev', points: ['多供应商接入（火山方舟/深度求索/通义）', '供应商插件包导入'] },
      { type: 'item', name: '模型列表与启用禁用', page: null, status: 'dev', points: [] },
      { type: 'item', name: '默认模型配置', page: null, status: 'dev', points: ['推理/Embedding/Rerank', '语音转文本/文本转语音', '内容审核'] },
      { type: 'item', name: '行业小模型管理', page: null, status: 'dev', points: ['小模型集成', '专有小模型部署', '节点级灵活选型'] }
    ]},
    { type: 'group', name: '知识中心', items: [
      { type: 'item', name: '知识库管理', page: null, status: 'dev', points: ['新建知识库（向量模型/切片策略）', '文档解析与向量化', '构建状态跟踪', '追加更新与增量向量化', '分类标签与搜索', '可见范围管理'] },
      { type: 'item', name: '知识增强', page: null, status: 'dev', points: ['知识总结', '知识扩充'] },
      { type: 'item', name: '知识检索优化', page: null, status: 'dev', points: ['Rerank重排序'] },
      { type: 'item', name: '知识图谱', page: null, status: 'dev', points: ['实体关系抽取', '多布局可视化', '图谱内检索与实体筛选'] },
      { type: 'item', name: '术语映射库', page: null, status: 'dev', points: [] },
      { type: 'item', name: '数据指令集', page: null, status: 'dev', points: ['Golden SQL自动生成', '试运行校验与优化'] },
      { type: 'item', name: '指标集管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '规则库定义', page: null, status: 'dev', points: [] },
      { type: 'item', name: '知识库开放API', page: null, status: 'dev', points: ['密钥鉴权'] }
    ]},
    { type: 'group', name: '模型微调', items: [
      { type: 'item', name: '微调数据集管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: 'SFT与偏好对齐任务', page: null, status: 'dev', points: [] },
      { type: 'item', name: '增量微调', page: null, status: 'dev', points: [] },
      { type: 'item', name: '版本评测与发布', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '编排中心', items: [
      { type: 'item', name: '应用管理', page: null, status: 'dev', points: ['Agent应用', 'Workflow应用', '多智能体协同应用'] },
      { type: 'item', name: '可视化编排画布', page: null, status: 'dev', points: ['节点库（LLM/分类器/问数/知识检索/分支循环/HTTP/代码/参数提取等）', '环境变量配置', '会话变量配置', '节点输出变量引用', '编辑自动保存'] },
      { type: 'item', name: '调试与发布', page: null, status: 'dev', points: ['试运行与调用链路', '检查清单校验', '版本管理与回滚', '配置YAML导入导出'] },
      { type: 'item', name: 'Prompt模板库', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '工具中心', items: [
      { type: 'item', name: '内置工具', page: null, status: 'dev', points: ['代码执行/时间处理/JSON处理', '网页抓取/学术检索', '图表生成/图片生成/语音处理'] },
      { type: 'item', name: '第三方工具授权管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '插件包导入', page: null, status: 'dev', points: [] },
      { type: 'item', name: 'MCP管理', page: null, status: 'dev', points: ['STDIO/SSE/STREAMABLE-HTTP', '官方MCP/自定义MCP', '连接测试'] },
      { type: 'item', name: '系统对接', page: null, status: 'dev', points: ['HTTP/API/工具节点对接OA与业务系统'] }
    ]},
    { type: 'group', name: '应用与市场', items: [
      { type: 'item', name: '快速搭建模板', page: null, status: 'dev', points: ['问数工作流', '问答工作流', '规则校验工作流'] },
      { type: 'item', name: '发布管理', page: null, status: 'dev', points: ['发布与发布更新', '专属市场/通用市场'] },
      { type: 'item', name: '公开访问', page: null, status: 'dev', points: ['独立访问链接', '多风格模板与亮暗主题', '数字人形态配置'] },
      { type: 'item', name: 'API集成', page: null, status: 'dev', points: ['接口文档', '密钥管理'] },
      { type: 'item', name: '运行日志与监控面板', page: null, status: 'dev', points: [] },
      { type: 'item', name: 'AI工作台', page: null, status: 'dev', points: ['应用浏览/搜索/标签筛选', '应用复制二次开发'] },
      { type: 'item', name: '对话体验配置', page: null, status: 'dev', points: ['开场白/下一步问题建议', '答案引用与归属', '语音与文件上传'] },
      { type: 'item', name: '知识分享', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '规则引擎', items: [
      { type: 'item', name: '规则库管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '字段提取', page: null, status: 'dev', points: ['大模型提取', '字段测试'] },
      { type: 'item', name: '规则管理', page: null, status: 'dev', points: ['大模型执行规则'] },
      { type: 'item', name: '工作流规则校验节点', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '测试与运营', items: [
      { type: 'item', name: '测试集与用例管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '批量测试与回归验证', page: null, status: 'dev', points: [] },
      { type: 'item', name: '测试量化分析', page: null, status: 'dev', points: ['准确率/相关性/耗时分布', '用例调用链路追溯'] },
      { type: 'item', name: '团队与权限管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '运营监控看板', page: null, status: 'dev', points: ['调用量', '失败率', 'Token消耗', '时延', 'GPU资源'] },
      { type: 'item', name: '人工介入机制', page: null, status: 'dev', points: [] }
    ]},
    { type: 'group', name: '平台管理', items: [
      { type: 'item', name: '用户角色组织管理', page: null, status: 'dev', points: [] },
      { type: 'item', name: '菜单按钮级权限', page: null, status: 'dev', points: [] },
      { type: 'item', name: '工作空间资源隔离', page: null, status: 'dev', points: [] },
      { type: 'item', name: 'API密钥管理', page: null, status: 'dev', points: ['创建与吊销'] }
    ]}
  ]
}

];
