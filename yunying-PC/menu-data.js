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
 *   - points: 规划要点数组，取自《功能架构（完整版）》三级功能点，用于占位页展示
 *
 * 【顺序】数组顺序 = 侧边栏展示顺序，调整顺序即移动数组元素，勿复制粘贴
 * ========================================================================== */

window.MENU_VERSION = '2026.09.09-03';
window.MENU_UPDATED = '2026-09-09';

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
    { type: 'item', name: '楼栋楼层管理', page: null, status: 'dev', points: ['楼栋列表', '楼层列表', '新增编辑'] },
    { type: 'item', name: '摊位商铺管理', page: null, status: 'dev', points: ['摊位列表', '商铺列表', '状态变更'] },
    { type: 'item', name: '平面图维护', page: null, status: 'dev', points: ['楼层平面图上传', '点位标注'] },
    { type: 'item', name: '资源状态看板', page: null, status: 'dev', points: ['出租率', '空置数', '状态分布'] }
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
  id: '04-merchant', name: '商户管理', icon: 'fa-store', open: false,
  children: [
    { type: 'item', name: '入驻申请审核', page: 'merchant.html', status: 'done', points: ['新增商户', '入驻申请列表', '通过/驳回'] },
    { type: 'item', name: '资料变更审核', page: 'merchant-change.html', status: 'done', points: ['申请列表', '通过/驳回'] },
    { type: 'item', name: '商户档案', page: 'merchant-profile.html', status: 'done', points: ['商户列表', '详情', '编辑', '画像标签'] },
    { type: 'item', name: '信用评级', page: 'merchant-rating.html', status: 'done', points: ['信用指标规则配置', '商户列表', '评级详情', '调整'] }
  ]
},

/* -------------------------------------------------------------- 05 合同管理 */
{
  id: '05-contract', name: '合同管理', icon: 'fa-file-contract', open: false,
  children: [
    { type: 'item', name: '合同模板管理', page: null, status: 'dev', points: ['模板列表', '新增编辑'] },
    { type: 'item', name: '合同签署留档', page: null, status: 'dev', points: ['合同列表', '签署状态', '归档查看'] }
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
    { type: 'item', name: '报修工单', page: null, status: 'dev', points: ['未处理列表', '已处理列表', '派单'] },
    { type: 'item', name: '巡检管理', page: 'inspection.html', status: 'done', points: ['巡检计划（新增/列表/编辑/删除）', '巡检任务（进行中/未开始/已结束）'] },
    { type: 'item', name: '问题上报', page: 'inspection-report.html', status: 'done', points: ['问题列表', '详情'] },
    { type: 'item', name: '整改派发', page: 'inspection-assign.html', status: 'done', points: ['整改进度（进行中）', '修改人员', '详情'] },
    { type: 'item', name: '整改复核', page: 'inspection-review.html', status: 'done', points: ['整改进度（已完成）', '复核关闭'] },
    { type: 'item', name: '保洁管理', page: null, status: 'dev', points: ['保洁计划（新增/列表/编辑/删除）', '保洁任务（进行中/未开始/已结束）'] },
    { type: 'item', name: '投诉建议', page: null, status: 'dev', points: ['投诉列表', '回复'] }
  ]
},

/* -------------------------------------------------------------- 08 活动运营 */
{
  id: '08-activity', name: '活动运营', icon: 'fa-calendar-check', open: false,
  children: [
    { type: 'item', name: '活动创建', page: 'activity.html', status: 'done', points: ['基本信息', '报名设置', '签到设置'] },
    { type: 'item', name: '活动列表', page: null, status: 'dev', points: ['上下架', '编辑', '删除'] },
    { type: 'item', name: '报名管理', page: 'activity-signup.html', status: 'done', points: ['报名名单', '审核', '导出'] },
    { type: 'item', name: '签到记录', page: 'activity-checkin.html', status: 'done', points: ['签到名单', '详情'] },
    { type: 'item', name: '活动审批', page: null, status: 'dev', points: ['商家创建活动审批'] }
  ]
},

/* -------------------------------------------------------------- 09 内容管理 */
{
  id: '09-content', name: '内容管理', icon: 'fa-newspaper', open: false,
  children: [
    { type: 'item', name: '资讯文章', page: 'content.html', status: 'done', points: ['新增', '资讯文章列表', '编辑', '删除'] },
    { type: 'item', name: '公告通知', page: 'content-notice.html', status: 'done', points: ['新增', '公告通知列表', '编辑', '删除'] },
    { type: 'item', name: 'Banner管理', page: 'content-banner.html', status: 'done', points: ['banner列表', '新增编辑'] }
  ]
},

/* -------------------------------------------------------------- 10 商城运营 */
{
  id: '10-mall', name: '商城运营', icon: 'fa-shop', open: false,
  children: [
    { type: 'item', name: '店铺管理', page: 'mall-shop.html', status: 'done', points: ['普通店铺', '品牌店铺（品牌馆展示）', '开通入驻商户身份'] },
    { type: 'item', name: '商品管理', page: 'mall-ops.html', status: 'done', points: ['袜品', 'AI自动审核', '上下架管控'] },
    { type: 'item', name: '视频管理', page: null, status: 'dev', points: ['商家视频上传', '下架'] },
    { type: 'item', name: '订单管理', page: null, status: 'dev', points: ['普通订单', '拼单集采', '定制订单（个性小批量/企业大批量）', '询价订单（采购需求清单）'] },
    { type: 'item', name: '营销运营', page: null, status: 'dev', points: ['团购活动', '秒杀活动', '新品发售', '尾货专区', '细分主题'] },
    { type: 'item', name: '热搜词管理', page: 'trend-data.html', status: 'done', points: ['关键词热度列表', '置顶', '隐藏'] },
    { type: 'item', name: '推荐位管理', page: null, status: 'dev', points: ['线下商场商铺推荐位'] },
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
      { type: 'item', name: '服务商管理', page: null, status: 'dev', points: ['新建（基本信息/配置链接）', '服务商列表（编辑删除、上下架）'] }
    ]},
    { type: 'group', name: '人才招聘', items: [
      { type: 'item', name: '企业管理', page: null, status: 'dev', points: ['新增', '关联入驻商户', '企业列表（编辑删除/关联岗位/招聘记录/评价）'] },
      { type: 'item', name: '岗位管理', page: null, status: 'dev', points: ['岗位列表', '详情'] },
      { type: 'item', name: '简历管理', page: null, status: 'dev', points: ['简历列表', '详情'] },
      { type: 'item', name: '投递管理', page: null, status: 'dev', points: ['投递记录', '详情', '回复记录'] }
    ]},
    { type: 'group', name: '知识产权', items: [
      { type: 'item', name: '配置管理', page: null, status: 'dev', points: ['新建', '列表'] }
    ]},
    { type: 'group', name: '技术共享', items: [
      { type: 'item', name: '需求发布管理', page: null, status: 'dev', points: ['需求列表', '对接详情'] },
      { type: 'item', name: '技术成果管理', page: null, status: 'dev', points: ['成果列表', '对接详情'] }
    ]},
    { type: 'group', name: '政策兑现', items: [
      { type: 'item', name: '政策发布', page: null, status: 'dev', points: ['新建', '政策列表'] }
    ]},
    { type: 'group', name: '中介服务', items: [
      { type: 'item', name: '服务发布管理', page: null, status: 'dev', points: ['新建', '服务列表（财务/法律/管理/认证检验）'] }
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
      { type: 'item', name: '袜博会列表', page: 'expo-list.html', status: 'done', points: ['创建（基本信息/展会介绍）', '每届信息（编辑删除、关联信息）', '栏目化配置一键同步'] },
      { type: 'item', name: '展位申请管理', page: 'expo-booth.html', status: 'done', points: ['待审批', '已通过', '已驳回', '展位可视化分配', '缴费状态'] },
      { type: 'item', name: '参观申请管理', page: 'expo-visitor.html', status: 'done', points: ['待审批', '已通过', '已驳回', '名单导出', '观众画像统计'] },
      { type: 'item', name: '参展商管理', page: 'expo-exhibitor.html', status: 'done', points: ['展商列表', '详情', '展位信息', '企业资料状态'] },
      { type: 'item', name: '日程安排管理', page: 'expo-schedule-manage.html', status: 'done', points: ['新建日程', '日程列表', '议程详情与嘉宾', '发布与变更通知'] },
      { type: 'item', name: '签到管理', page: 'expo-checkin.html', status: 'done', points: ['签到名单', '详情', '手工补签', '到场率统计'] },
      { type: 'item', name: '资料管理', page: 'expo-material.html', status: 'done', points: ['官方资料上传与策略', '展商资料审核', '下载量统计'] },
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
      { type: 'item', name: '数据资产目录规划', page: null, status: 'dev', points: [] }
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
