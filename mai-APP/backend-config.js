/* ============================================================
 * 后台配置下发（买家端只读 · 静态模拟数据）
 * ------------------------------------------------------------
 * 数据主权：以下配置均由运营管理端（yunying-PC）唯一写入，
 * 买家端（mai-APP）只读消费，不在本地改写。
 * 对应 PRD：14a 研学管理 / 14b 袜博会管理
 * ------------------------------------------------------------
 * STUDY_CFG   —— 研学：基地、路线上下架、场次余席、责任书模板、精选评价、出行须知
 * EXPO_CFG    —— 袜博会：届次、规模数据、展位类型、平面图格子、精选展商、往届回顾、展会介绍
 * EXPO_SESSIONS —— 袜博会议程（全局唯一 ID，格式 S{年}-{天}-{序号}）
 * ============================================================ */

/* ===================== 研学配置 ===================== */
var STUDY_CFG = {

  /* 研学基地（后台「研学基地管理」维护，status: 启用 / 停用） */
  bases: [
    {id:1,name:'大唐袜业博物馆',img:'images/scene_10.jpg',desc:'展示大唐袜业40年发展历程，馆藏珍贵文物300余件，含VR全景体验区',loc:'大唐镇中心',rating:'4.9',routes:2,status:'启用'},
    {id:2,name:'智能制造工厂',img:'images/machine_01.jpg',desc:'全自动化织袜生产线，1500台智能袜机，日均产能超百万双',loc:'大唐工业园',rating:'4.8',routes:2,status:'启用'},
    {id:3,name:'原料检测中心',img:'images/material_02.jpg',desc:'国家级纺织品检测实验室，了解纱线品质检测全流程',loc:'大唐科技园',rating:'4.7',routes:1,status:'停用'}
  ],

  /* 研学路线在售状态与名额状态（后台「研学线路活动管理」维护）
     sale: 在售 / 下架   seatStatus: 可报名 / 仅剩少量 / 已满 */
  routes: {
    1:{sale:'在售',left:18,seatStatus:'可报名'},
    2:{sale:'在售',left:8,seatStatus:'仅剩少量'},
    3:{sale:'下架',left:0,seatStatus:'已满'}
  },

  /* 研学场次（后台「场次管理」维护，left=余席，waitNum=候补人数，waitOn=候补开关） */
  sessions: {
    1:[
      {date:'2026年9月15日',day:'周六',status:'可报名',left:18,total:50,waitOn:false,waitNum:0},
      {date:'2026年9月22日',day:'周六',status:'可报名',left:32,total:50,waitOn:false,waitNum:0},
      {date:'2026年10月13日',day:'周一',status:'仅剩少量',left:6,total:50,waitOn:true,waitNum:3},
      {date:'2026年10月20日',day:'周一',status:'已满',left:0,total:50,waitOn:true,waitNum:8}
    ],
    2:[
      {date:'2026年9月12日',day:'周四',status:'可报名',left:45,total:80,waitOn:false,waitNum:0},
      {date:'2026年9月19日',day:'周四',status:'可报名',left:60,total:80,waitOn:false,waitNum:0},
      {date:'2026年10月12日',day:'周六',status:'仅剩少量',left:8,total:80,waitOn:true,waitNum:5},
      {date:'2026年10月19日',day:'周六',status:'可报名',left:50,total:80,waitOn:true,waitNum:0}
    ],
    3:[
      {date:'2026年9月16日',day:'周日',status:'可报名',left:12,total:40,waitOn:false,waitNum:0},
      {date:'2026年9月23日',day:'周日',status:'仅剩少量',left:5,total:40,waitOn:true,waitNum:2},
      {date:'2026年10月14日',day:'周二',status:'可报名',left:20,total:40,waitOn:false,waitNum:0},
      {date:'2026年10月21日',day:'周二',status:'已满',left:0,total:40,waitOn:true,waitNum:6}
    ]
  },

  /* 安全责任书模板（后台「责任书模板管理」维护） */
  liability: {
    personal:[
      '乙方确认学生身体健康，无不适合参加研学活动的疾病。',
      '乙方负责学生往返途中的安全护送，按时到达集合地点。',
      '研学期间，乙方授权甲方及带队老师在紧急情况下代为处置。',
      '乙方须为学生购买意外保险，并提供保险信息。',
      '学生在研学期间须遵守纪律，听从指挥，不得擅自离队。',
      '如因乙方或学生自身原因造成安全事故，甲方不承担责任。',
      '本责任书自家长签字之日起生效，至研学活动结束止。'
    ],
    group:[
      '甲方负责提供安全的研学场地和专业讲解服务。',
      '乙方负责学生安全管理和纪律维护，配备足够带队老师。',
      '乙方须为学生购买意外保险，并提交保险信息。',
      '研学过程中如发生意外，双方按照相关法规协商处理。',
      '乙方负责人签署后本责任书即生效，至研学活动结束止。'
    ]
  },

  /* 后台精选的评价（评价审核通过后同步至买家端） */
  reviews: [
    {name:'王老师',school:'浙江大学',avatar:'W',avatarBg:'#3B82F6',rating:5,date:'2026-06-20',route:1,content:'研学内容丰富，讲解专业，学生们对智能制造有了直观认识。特别是互动体验环节，每个学生都能近距离观察袜机运作，收获很大。'},
    {name:'李老师',school:'杭州学军中学',avatar:'L',avatarBg:'#7C3AED',rating:5,date:'2026-06-15',route:2,content:'博物馆的文化底蕴很深厚，VR体验区是最大亮点，研学任务卡设计得很好，寓教于乐。'},
    {name:'张老师',school:'杭州二中',avatar:'Z',avatarBg:'#059669',rating:5,date:'2026-06-10',route:3,content:'体验营一日行程安排合理，技师耐心指导，每个学生都带走了自己织的袜子，动手实践模式非常值得推广。'}
  ],

  /* 出行须知（系统管理员维护） */
  notices: [
    '集合时间：出行当日上午 9:00，请提前 10 分钟到达',
    '集合地点：大唐袜业城游客服务中心一楼大厅',
    '请穿着舒适服装和运动鞋，勿穿高跟鞋或凉鞋',
    '工厂区域内请勿触碰设备，听从讲解员指挥',
    '携带物品：学生证/身份证、笔记本、水杯'
  ],

  /* 改期通知（后台改期后下发，买家端站内消息示意） */
  reschedule: {
    on:true,
    id:'RC20260910001',
    title:'场次改期通知',
    content:'您报名的「智能制造工厂参观」原定 2026年9月12日场次已改期至 2026年9月15日（周六），如无法参加可在出行前 24 小时自助取消。',
    time:'2026-09-10 09:30'
  }
};

/* ===================== 袜博会配置 ===================== */
var EXPO_CFG = {

  /* 本届展会配置（后台「袜博会列表 - 展会配置」维护） */
  edition:{
    no:18, year:2026,
    name:'中国国际袜业博览会',
    enName:'SOCK INDUSTRY EXPO 2026',
    slogan:'智造袜业·链通全球',
    start:'2026-10-18', end:'2026-10-20',
    openAt:'2026-10-18T09:00:00',
    venue:'大唐袜业城',
    dateText:'10.18-10.20',
    cover:'images/scene_07.jpg'
  },

  /* 规模数据四项（可手动维护或系统统计） */
  scale:[
    {value:'5万',label:'㎡展览面积'},
    {value:'800+',label:'家展商'},
    {value:'5万+',label:'名观众'},
    {value:'2000+',label:'个展位'}
  ],

  /* 展位平面图格子（后台「平面图排布」维护）
     type: free 可选 / booked 已预订 / sold 已售出 / locked 已锁定 / entry 入口 / aisle 通道 */
  boothRows:[
    [
      {id:'A01',type:'sold'},{id:'A02',type:'sold'},{id:'A03',type:'sold'},
      {id:'A04',type:'sold'},{id:'A05',type:'booked'},{id:'A06',type:'free'}
    ],
    'aisle',
    [
      {id:'B01',type:'sold'},{id:'B02',type:'booked'},{id:'入口',type:'entry'},
      {id:'B03',type:'free'},{id:'B04',type:'locked'},{id:'B05',type:'sold'}
    ]
  ],

  /* 精选展商（后台「精选展商配置」维护） */
  exhibitors:[
    {id:1,name:'丹吉娅',tag:'品牌展商',tagBg:'linear-gradient(90deg,#FB7185,#EC4899)',booth:'A01-A02',cat:'袜品',img:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E5%B1%95%E4%BC%9A%E5%93%81%E7%89%8C%E5%B1%95%E4%BD%8D%E5%8D%8E%E4%B8%BD%E7%81%AF%E5%85%89%E4%B8%8B%E7%B2%BE%E7%BE%8E%E8%A2%9C%E5%93%81%E5%B1%95%E7%A4%BA%E6%9F%9C%E5%8F%B0%E7%8E%B0%E4%BB%A3%E7%AE%80%E6%B4%81&image_size=square',desc:'国内知名袜品品牌，主营中高端棉袜、运动袜，年产能超 8000 万双，本届首发智能温控系列。'},
    {id:2,name:'步人堂',tag:'智能袜机',tagBg:'linear-gradient(90deg,#A78BFA,#7C3AED)',booth:'C05',cat:'袜机设备',img:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E6%99%BA%E8%83%BD%E8%A2%8C%E6%9C%BA%E8%AE%BE%E5%A4%87%E5%B1%95%E4%BD%8D%E7%8E%B0%E4%BB%A3%E5%B7%A5%E4%B8%9A%E9%A3%8E%E6%A0%BC%E7%B2%BE%E5%AF%86%E9%87%91%E5%B1%9E%E8%B4%A8%E6%84%9F&image_size=square',desc:'全电脑提花袜机厂商，本届现场演示最新一代 3D 编织设备与 AI 智能品控方案。'},
    {id:3,name:'宝娜斯',tag:'丝袜',tagBg:'linear-gradient(90deg,#34D399,#10B981)',booth:'A03-A04',cat:'袜品',img:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E7%94%9F%E4%B8%9D%E8%A2%9C%E5%B1%95%E7%A4%BA%E5%8C%85%E8%A3%85%E7%9B%92%E7%B2%BE%E8%87%B4%E6%97%B6%E5%B0%9A%E5%B1%95%E7%BD%A9%E7%81%AF%E5%85%89&image_size=square',desc:'丝袜与打底裤头部品牌，本届带来石墨烯抗菌、相变调温等功能性新品。'},
    {id:4,name:'情怡袜业',tag:'运动袜',tagBg:'linear-gradient(90deg,#FBBF24,#F59E0B)',booth:'B01-B02',cat:'袜品',img:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E8%BF%90%E5%8A%A8%E8%A2%8C%E5%B1%95%E7%A4%BA%E6%97%B6%E5%B0%9A%E5%B1%95%E4%BD%8D%E6%B4%BB%E5%8A%9B%E6%98%8E%E4%BA%AE%E7%81%AF%E5%85%89&image_size=square',desc:'运动压缩袜专业制造商，为多个国际运动品牌提供代工，本届发布专业跑步压缩系列。'}
  ],

  /* 往届回顾（后台「往届回顾配置」维护） */
  archives:[
    {img:'images/scene_09.jpg',title:'第17届现场',desc:'2025年第17届袜博会现场盛况，展览面积 4.5 万㎡，到场专业观众 4.6 万人次。'},
    {img:'images/scene_02.jpg',title:'开幕仪式',desc:'第17届开幕仪式，行业协会与地方政府代表共同剪彩，宣布展会开幕。'},
    {img:'images/scene_03.jpg',title:'新品展示',desc:'品牌展商新品发布区，30+ 品牌集中首发当季秋冬新品。'}
  ],

  /* 展会介绍（后台「展会介绍配置」维护） */
  info:{
    summary:[
      '中国国际袜业博览会（大唐袜博会）始办于2003年，每年秋季在"中国袜业之乡"——浙江诸暨大唐举办，现已发展成为全球规模最大、影响力最广的袜业专业展会之一。',
      '第18届袜博会以"智造袜业·链通全球"为主题，展览面积5万平方米，设置国际标准展位2000+个，汇聚国内外800+优质展商，预计吸引5万+专业采购商和观众到场参观采购。'
    ],
    orgs:[
      {label:'主办单位',value:'中国纺织工业联合会 · 诸暨市人民政府'},
      {label:'承办单位',value:'大唐袜业城管委会 · 浙江省袜业协会'},
      {label:'协办单位',value:'中国针织工业协会 · 浙江省商务厅'},
      {label:'支持单位',value:'阿里巴巴国际站 · 亚马逊全球开店'}
    ],
    scope:[
      {name:'袜品系列',desc:'棉袜/丝袜/运动袜/功能袜',icon:'fas fa-socks',bg:'linear-gradient(135deg,#FB7185,#EC4899)'},
      {name:'袜机设备',desc:'织袜机/缝头机/定型机',icon:'fas fa-gears',bg:'linear-gradient(135deg,#38BDF8,#3B82F6)'},
      {name:'原料纱线',desc:'棉/尼龙/氨纶/功能性纱线',icon:'fas fa-circle-nodes',bg:'linear-gradient(135deg,#FBBF24,#F59E0B)'},
      {name:'设计包装',desc:'花型设计/包装材料/吊牌',icon:'fas fa-palette',bg:'linear-gradient(135deg,#A78BFA,#7C3AED)'},
      {name:'物流服务',desc:'跨境物流/仓储/清关',icon:'fas fa-truck-fast',bg:'linear-gradient(135deg,#34D399,#10B981)'},
      {name:'跨境服务',desc:'电商平台/代运营/品牌出海',icon:'fas fa-globe',bg:'linear-gradient(135deg,#EC4899,#FB7185)'}
    ],
    highlights:[
      {name:'袜业高质量发展论坛',desc:'行业领袖、专家学者共话袜业智造升级与品牌出海，发布行业白皮书',icon:'fas fa-microphone',bg:'linear-gradient(135deg,#EC4899,#FB7185)'},
      {name:'供需精准对接会',desc:'国内外采购商与展商一对一洽谈，预计促成意向交易额超10亿元',icon:'fas fa-arrow-right-arrow-left',bg:'linear-gradient(135deg,#34D399,#10B981)'},
      {name:'新品发布会',desc:'30+品牌集中发布秋冬新品，智能温控袜、运动压缩袜等黑科技首秀',icon:'fas fa-bullhorn',bg:'linear-gradient(135deg,#38BDF8,#3B82F6)'},
      {name:'跨境电商选品大会',desc:'亚马逊、Temu、TikTok等平台官方到场，一站式选品+供应链对接',icon:'fas fa-globe',bg:'linear-gradient(135deg,#A78BFA,#7C3AED)'}
    ],
    traffic:[
      {name:'展会地址',desc:'浙江省诸暨市大唐袜业城展览中心',icon:'fas fa-location-dot',color:'#EC4899'},
      {name:'机场到达',desc:'杭州萧山机场 → 大唐（展会专线大巴，约90分钟）',icon:'fas fa-plane',color:'#3B82F6'},
      {name:'高铁到达',desc:'诸暨站 → 出站打车至大唐袜业城（约15分钟）',icon:'fas fa-train',color:'#34D399'},
      {name:'自驾前往',desc:'G60沪昆高速 → 诸暨出口 → S308省道 → 大唐袜业城（展馆设免费停车场3000个车位）',icon:'fas fa-car',color:'#FBBF24'}
    ]
  }
};

/* ===================== 袜博会议程（全局唯一 ID） =====================
 * ID 规则：S{年份}-{天}-{三位序号}，如 S2026-3-004 = 第18届第3天第4场
 * 后台「日程安排管理」为每条议程分配唯一 ID，买家端按 ID 定位，不再使用「天+下标」
 * ==================================================================== */
var EXPO_SESSIONS = {

  /* ---------- Day 1 · 10.18 开幕日 ---------- */
  'S2026-1-001':{day:1,seq:1,time:'08:30-09:00',title:'嘉宾签到入场',loc:'主会场·签到处',type:'签到',typeBg:'#D1FAE5',typeColor:'#059669',speaker:'',
    desc:'参展商、采购商及嘉宾凭电子入场证或邀请函在签到处完成签到，领取展会资料包和参观证。签到后可进入展馆休息区享用早茶。',
    highlights:[{t:'快速签到通道',d:'设置6条签到通道，平均等待时间不超过5分钟'},{t:'资料包领取',d:'含展商名录、参观指南、日程手册等纸质资料'}],speakers:[]},
  'S2026-1-002':{day:1,seq:2,time:'09:00-09:30',title:'开幕仪式',loc:'主会场·A馆舞台',type:'仪式',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'诸暨市领导/行业协会代表',
    desc:'第18届中国国际袜业博览会开幕仪式，由诸暨市领导致开幕词，中国纺织工业联合会代表致辞，随后进行剪彩仪式，宣布展会正式开幕。',
    highlights:[{t:'市领导开幕致辞',d:'诸暨市委书记致辞，介绍大唐袜业产业发展成果'},{t:'剪彩仪式',d:'行业协会领导与政府代表共同剪彩'},{t:'舞狮表演',d:'传统舞狮开场，烘托盛会气氛'}],
    speakers:[{name:'诸暨市领导',role:'开幕致辞',org:'诸暨市人民政府'},{name:'行业协会代表',role:'行业致辞',org:'中国纺织工业联合会'}]},
  'S2026-1-003':{day:1,seq:3,time:'09:30-10:00',title:'展馆正式开放',loc:'全馆开放',type:'展览',typeBg:'#DBEAFE',typeColor:'#2563EB',speaker:'',
    desc:'A/B/C/D四大展馆正式对专业观众开放，800+展商就位，涵盖袜品、袜机设备、原料纱线、设计包装、物流服务、跨境服务等全产业链展品。',
    highlights:[{t:'800+展商同步开放',d:'4大展馆、2000+展位一站式参观'},{t:'新品首发区',d:'30+品牌在A馆中央首发秋冬新品'},{t:'互动体验区',d:'袜品试穿、3D量脚定制等体验活动'}],speakers:[]},
  'S2026-1-004':{day:1,seq:4,time:'10:00-11:30',title:'袜业高质量发展论坛',loc:'论坛区·会议厅A',type:'论坛',typeBg:'#FEF3C7',typeColor:'#D97706',speaker:'中国纺织工业联合会领导/行业专家',
    desc:'本届论坛以"智造袜业·链通全球"为核心议题，邀请行业专家学者及头部企业代表，共同探讨袜业智能制造升级路径、品牌出海策略与新材料应用趋势。论坛期间将重磅发布《2026中国袜业产业白皮书》。',
    highlights:[{t:'白皮书发布',d:'中国针织工业协会发布年度行业白皮书'},{t:'智能制造圆桌',d:'袜机厂商与工厂代表共话数字化转型'},{t:'品牌出海分享',d:'头部品牌分享海外市场拓展实战经验'}],
    speakers:[{name:'张明华',role:'主旨演讲',org:'中国纺织工业联合会 副会长'},{name:'李国强',role:'圆桌嘉宾',org:'浙江省袜业协会 会长'},{name:'陈晓燕',role:'白皮书发布',org:'中国针织工业协会 秘书长'}]},
  'S2026-1-005':{day:1,seq:5,time:'11:30-12:00',title:'2026中国袜业白皮书发布',loc:'论坛区·会议厅A',type:'发布',typeBg:'#EDE9FE',typeColor:'#7C3AED',speaker:'中国针织工业协会秘书长',
    desc:'中国针织工业协会秘书长现场发布《2026中国袜业产业白皮书》，从市场规模、产业链结构、出口贸易、技术创新、消费趋势等维度，全面解析中国袜业发展现状与未来方向。',
    highlights:[{t:'权威数据发布',d:'覆盖全国袜业产业链的年度统计与分析'},{t:'趋势预测',d:'未来3年袜业市场发展方向与增长预测'},{t:'免费领取',d:'到场嘉宾可领取纸质版白皮书一本'}],
    speakers:[{name:'陈晓燕',role:'主讲人',org:'中国针织工业协会 秘书长'}]},
  'S2026-1-006':{day:1,seq:6,time:'13:30-15:00',title:'智能袜机技术交流会',loc:'技术区·会议厅B',type:'交流',typeBg:'#DBEAFE',typeColor:'#2563EB',speaker:'意大利罗纳地/日本岛精代表',
    desc:'邀请意大利罗纳地、日本岛精等国际袜机厂商技术代表，分享最新智能袜机技术进展，包括全电脑提花、3D编织、AI智能品控等前沿技术，并现场演示最新设备。',
    highlights:[{t:'国际厂商技术分享',d:'意大利罗纳地、日本岛精等代表现场分享'},{t:'设备现场演示',d:'最新型号袜机现场运行展示'},{t:'技术答疑',d:'工厂可就技术升级问题现场咨询'}],
    speakers:[{name:'Marco Rossi',role:'技术分享',org:'意大利罗纳地集团'},{name:'田中太郎',role:'技术分享',org:'日本岛精机制作所'}]},
  'S2026-1-007':{day:1,seq:7,time:'15:00-17:00',title:'品牌展商新品路演',loc:'路演区·中央舞台',type:'路演',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'8家头部品牌依次路演',
    desc:'8家头部品牌依次上台路演，集中展示2026秋冬新品系列，包括智能温控袜、运动压缩袜、抗菌防臭袜等创新产品，每家品牌15分钟路演+5分钟互动答疑。',
    highlights:[{t:'8大品牌新品首秀',d:'丹吉娅、宝娜斯、情怡等头部品牌轮番路演'},{t:'黑科技首秀',d:'智能温控袜、运动压缩袜等创新产品'},{t:'现场下单优惠',d:'路演期间下单享展会专属折扣'}],
    speakers:[{name:'各品牌设计总监',role:'新品讲解',org:'8家头部品牌'}]},
  'S2026-1-008':{day:1,seq:8,time:'17:30-19:00',title:'欢迎晚宴（凭邀请函）',loc:'大唐·袜业宴会厅',type:'社交',typeBg:'#D1FAE5',typeColor:'#059669',speaker:'',
    desc:'组委会设欢迎晚宴招待国内外采购商、展商代表与行业嘉宾，凭邀请函入场，晚宴期间安排自由交流与供需对接。',
    highlights:[{t:'凭邀请函入场',d:'受邀嘉宾可携1位随行人员'},{t:'自由交流',d:'与展商、采购商面对面沟通'}],speakers:[]},

  /* ---------- Day 2 · 10.19 专业日 ---------- */
  'S2026-2-001':{day:2,seq:1,time:'09:00-12:00',title:'供需精准对接会',loc:'对接区·洽谈厅A-D',type:'对接',typeBg:'#FEF3C7',typeColor:'#D97706',speaker:'200+采购商与展商一对一洽谈',
    desc:'200+国内外采购商与展商一对一洽谈对接，组委会提前匹配供需双方需求，每轮洽谈15分钟，共4轮，预计促成意向交易额超10亿元。',
    highlights:[{t:'智能匹配',d:'组委会根据采购需求智能匹配展商'},{t:'4轮一对一洽谈',d:'每轮15分钟，高效精准'},{t:'翻译服务',d:'提供英语、日语、韩语等翻译支持'}],speakers:[]},
  'S2026-2-002':{day:2,seq:2,time:'09:30-10:30',title:'跨境出海峰会',loc:'论坛区·会议厅A',type:'论坛',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'亚马逊/Temu/TikTok官方代表',
    desc:'亚马逊、Temu、TikTok Shop 等平台官方团队到场，解读 2026 跨境袜品品类趋势、平台招商政策与合规要求，并分享头部卖家增长案例。',
    highlights:[{t:'平台官方解读',d:'三大平台招商经理现场答疑'},{t:'品类趋势报告',d:'跨境袜品细分品类增长数据首发'},{t:'合规指南',d:'欧美纺织品标签与环保合规要点'}],
    speakers:[{name:'亚马逊官方代表',role:'平台分享',org:'亚马逊全球开店'},{name:'Temu 官方代表',role:'平台分享',org:'Temu'}]},
  'S2026-2-003':{day:2,seq:3,time:'10:30-12:00',title:'新材料·新工艺发布会',loc:'路演区·中央舞台',type:'发布',typeBg:'#EDE9FE',typeColor:'#7C3AED',speaker:'杜邦/兰精/巴斯夫等原料商',
    desc:'杜邦、兰精、巴斯夫等国际原料商集中发布最新功能性纤维与新材料，包括竹纤维、石墨烯纤维、相变调温纤维等，并分享最新染色与后整理工艺。',
    highlights:[{t:'国际原料商齐聚',d:'杜邦、兰精、巴斯夫等集中发布'},{t:'功能性纤维首秀',d:'石墨烯、相变调温等黑科技材料'},{t:'工艺方案分享',d:'最新无水染色、数字印花等环保工艺'}],
    speakers:[{name:'杜邦代表',role:'新材料发布',org:'杜邦中国'},{name:'兰精代表',role:'纤维技术分享',org:'兰精集团'}]},
  'S2026-2-004':{day:2,seq:4,time:'14:00-15:30',title:'30+品牌新品发布会',loc:'路演区·中央舞台',type:'发布',typeBg:'#DBEAFE',typeColor:'#2563EB',speaker:'各品牌设计总监',
    desc:'30+ 品牌集中发布 2026 秋冬新品，覆盖商务、运动、户外、儿童等场景，现场公布订货政策与展会专属折扣。',
    highlights:[{t:'30+品牌集中发布',d:'覆盖商务、运动、户外、儿童全场景'},{t:'订货政策公布',d:'展会期间订货享阶梯折扣'}],
    speakers:[{name:'各品牌设计总监',role:'新品发布',org:'30+参展品牌'}]},
  'S2026-2-005':{day:2,seq:5,time:'14:00-16:00',title:'跨境电商选品大会',loc:'对接区·洽谈厅E',type:'对接',typeBg:'#D1FAE5',typeColor:'#059669',speaker:'电商平台官方选品团队',
    desc:'亚马逊、TikTok Shop、快手等平台官方选品团队现场选品，卖家可携带样品报名参与，通过平台初审即可进入官方推荐池。',
    highlights:[{t:'官方选品团队到场',d:'多平台买手现场看样'},{t:'带样报名',d:'现场提交样品进入推荐池'}],
    speakers:[{name:'平台选品团队',role:'现场选品',org:'各大电商平台'}]},
  'S2026-2-006':{day:2,seq:6,time:'16:00-17:30',title:'袜业设计大赛决赛',loc:'主会场·A馆舞台',type:'赛事',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'评委团/入围设计师',
    desc:'首届"大唐杯"袜业设计大赛决赛，20组入围设计师现场展示原创袜品设计作品，评委团从创意性、可量产性、市场潜力等维度评分，现场颁奖。',
    highlights:[{t:'20组决赛作品',d:'从全国300+投稿中脱颖而出的原创设计'},{t:'专家评委团',d:'行业协会专家+品牌设计总监联合评审'},{t:'观众投票',d:'现场观众扫码投票选出"人气奖"'}],
    speakers:[{name:'评委团',role:'专业评审',org:'行业协会+头部品牌'}]},
  'S2026-2-007':{day:2,seq:7,time:'18:00-20:00',title:'行业交流酒会',loc:'大唐·袜业宴会厅',type:'社交',typeBg:'#D1FAE5',typeColor:'#059669',speaker:'',
    desc:'专业日闭馆后的行业交流酒会，为展商、采购商与设计师提供轻松的社交场景，现场设置自由对接与名片交换环节。',
    highlights:[{t:'自由对接',d:'轻松场景下深度沟通'},{t:'名片交换',d:'现场提供名片墙与交换服务'}],speakers:[]},

  /* ---------- Day 3 · 10.20 公众日 ---------- */
  'S2026-3-001':{day:3,seq:1,time:'09:00-12:00',title:'公众开放日',loc:'全馆开放',type:'展览',typeBg:'#DBEAFE',typeColor:'#2563EB',speaker:'',
    desc:'展会最后一天面向公众开放，消费者可自由参观全部展馆，参与互动体验活动，现场购买展会特惠袜品。',
    highlights:[{t:'全馆自由参观',d:'凭参观登记入场码即可入场'},{t:'展会特惠',d:'众多展商现场零售特惠'}],speakers:[]},
  'S2026-3-002':{day:3,seq:2,time:'09:30-10:30',title:'网红达人探馆直播',loc:'全馆巡馆',type:'直播',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'10+头部达人',
    desc:'10+头部网红达人到场巡馆直播，带线上观众云逛展，在各展位进行产品体验和互动，直播期间发放专属优惠券，线上线下同步带货。',
    highlights:[{t:'10+达人同步直播',d:'抖音、快手、小红书等多平台同步'},{t:'专属直播优惠',d:'直播期间限量发放展会专属优惠券'},{t:'展商互动环节',d:'达人到展位现场体验新品并采访展商'}],
    speakers:[{name:'10+头部达人',role:'探馆直播',org:'各平台达人'}]},
  'S2026-3-003':{day:3,seq:3,time:'10:30-11:30',title:'消费者互动体验活动',loc:'互动区·中央广场',type:'活动',typeBg:'#D1FAE5',typeColor:'#059669',speaker:'',
    desc:'面向公众的互动体验活动，含织袜机体验、袜子 DIY 印花、3D 量脚定制等环节，适合亲子家庭参与。',
    highlights:[{t:'织袜机体验',d:'亲手操作半自动织袜机'},{t:'袜子DIY印花',d:'现场定制专属图案'},],speakers:[]},
  'S2026-3-004':{day:3,seq:4,time:'13:00-14:00',title:'采购商抽奖活动',loc:'主会场·A馆舞台',type:'活动',typeBg:'#FEF3C7',typeColor:'#D97706',speaker:'凭采购证件参与',
    desc:'面向到场采购商的抽奖活动，凭采购证件参与，奖品包含展会纪念礼包、下届展位优惠券等。',
    highlights:[{t:'凭采购证件参与',d:'现场登记即可获得抽奖资格'},{t:'多重好礼',d:'纪念礼包与下届展位优惠券'}],speakers:[]},
  'S2026-3-005':{day:3,seq:5,time:'14:00-15:00',title:'颁奖典礼暨闭幕仪式',loc:'主会场·A馆舞台',type:'仪式',typeBg:'#FCE7F3',typeColor:'#EC4899',speaker:'组委会/获奖企业代表',
    desc:'展会最后一天，举行各项评选颁奖典礼，包括最佳展位设计奖、最受欢迎品牌奖、设计大赛获奖作品等，随后组委会致闭幕词，宣布第18届袜博会圆满闭幕。',
    highlights:[{t:'多项大奖揭晓',d:'最佳展位、最受欢迎品牌、设计大赛等奖项'},{t:'闭幕致辞',d:'组委会总结展会成果，展望下届'},{t:'下届预告',d:'现场预告第19届袜博会时间与主题'}],
    speakers:[{name:'组委会代表',role:'闭幕致辞',org:'袜博会组委会'}]},
  'S2026-3-006':{day:3,seq:6,time:'15:00-16:00',title:'展馆闭幕撤展',loc:'全馆',type:'展览',typeBg:'#E5E7EB',typeColor:'#6B7280',speaker:'',
    desc:'展会正式闭幕，展商按组委会安排有序撤展，观众请于 15:00 前离场。',
    highlights:[{t:'有序撤展',d:'展商凭撤展证办理手续'}],speakers:[]}
};

/* 按天取议程列表（保持 seq 升序） */
function expoSessionsByDay(day){
  var list=[];
  for(var k in EXPO_SESSIONS){
    if(EXPO_SESSIONS[k].day===day)list.push({id:k,s:EXPO_SESSIONS[k]});
  }
  list.sort(function(a,b){return a.s.seq-b.s.seq});
  return list;
}
