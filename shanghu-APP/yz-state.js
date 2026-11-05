/* ============================================================
   商户端「企业资质认证」状态 · 端内共享读取工具（待办 #53 / #54）
   ------------------------------------------------------------
   · 唯一数据源：localStorage['sh_yz_state']，由 shanghu-verify.html 写入
   · 本文件只统一「同一端内多页」的状态读取与文案映射，
     不搭建任何「前端读取 / 同步后台数据」的架构
   · 引用页：shanghu-verify.html（写）、shanghu-inquiry.html、
             shanghu-inquiry-detail.html、policy-service.html（只读）
   · 状态：none 未提交 / reviewing 审核中 / pass 已通过 / reject 已驳回
           expiring 即将到期（≤30 天，资质仍有效）/ expired 已过期
           invalid 已失效（到期不再续期）
   · 运营端对应：yunying-PC/merchant-qual.html「到期处理」
     （换证续期 / 顺延 / 不再续期，基准日 2026-11-05 与后台一致）
   ============================================================ */
var YZ_KEY='sh_yz_state';
var YZ_TODAY='2026-11-05';
var YZ_DEF_EXPIRE='2027-09-20';
var YZ_EXPIRING_DATE='2026-11-25';
var YZ_EXPIRED_DATE='2026-10-31';
var YZ_RENEW_DATE='2029-11-05';
var YZ_EXTEND_DATE='2027-11-05';
var YZ_STATES=['none','reviewing','pass','reject','expiring','expired','invalid'];
var YZ_LABEL={none:'未提交',reviewing:'审核中',pass:'已通过',reject:'已驳回',expiring:'即将到期',expired:'已过期',invalid:'已失效'};
var YZ_COLOR={none:['#F1F5F9','#64748B'],reviewing:['#EFF6FF','#2563EB'],pass:['#ECFDF5','#059669'],reject:['#FEF2F2','#DC2626'],expiring:['#FFF7ED','#C2410C'],expired:['#FEF2F2','#B91C1C'],invalid:['#F1F5F9','#64748B']};

function yzDays(d){
  if(!d)return 0;
  var a=new Date(YZ_TODAY+'T00:00:00'),b=new Date(d+'T00:00:00');
  if(isNaN(b.getTime()))return 0;
  return Math.round((b-a)/86400000);
}
function getYZ(){
  var o=null;
  try{o=JSON.parse(localStorage.getItem(YZ_KEY)||'null');}catch(e){}
  if(!o||!o.state)o={state:localStorage.getItem('sh_verify')||'none'};
  if(YZ_STATES.indexOf(o.state)<0)o.state='none';
  if(!o.subject)o.subject='enterprise';
  if(!o.expire)o.expire=YZ_DEF_EXPIRE;
  if(!o.origExpire)o.origExpire=o.expire;
  if(!o.handle)o.handle='';
  return o;
}
function saveYZ(o){
  localStorage.setItem(YZ_KEY,JSON.stringify(o));
  localStorage.setItem('sh_verify',o.state); /* 兼容旧键 */
  return o;
}
/* 资质是否仍有效：已通过 + 即将到期（30 天内仍可询价），其余冻结 */
function yzPass(s){return s==='pass'||s==='expiring';}
/* 到期处理结论文案（商户端只展示结果，不展示运营端经办人与抽屉记录） */
function yzHandleText(h){
  return {renew:'本次处理：换证续期（新证已核验）',extend:'本次处理：到期顺延（运营端经办）',stop:'本次处理：不再续期（资质已失效）'}[h]||'';
}
/* 询价闸门文案：首次未认证 / 已过期 / 不再续期 三态区分，另兼容审核中、已驳回 */
function yzGate(s,o){
  o=o||{};
  var d=(s==='expired'||s==='invalid')?(o.origExpire||o.expire||YZ_EXPIRED_DATE):o.expire;
  var G={
    none:{title:'未完成企业资质认证',sub:'认证通过后方可查看供需详情、参与询价（招标验收必查）',btn:'去认证',bg:'#FFF7ED',bd:'#FED7AA',fg:'#C2410C',sub2:'#EA580C',bar:'#F59E0B',bar2:'#D97706',icon:'fa-triangle-exclamation'},
    reviewing:{title:'资质审核中，暂不可查看供需详情与参与询价',sub:'AI 预审 + 人工复核 · 预计 1-2 个工作日',btn:'查看进度',bg:'#EFF6FF',bd:'#BFDBFE',fg:'#1D4ED8',sub2:'#2563EB',bar:'#3B82F6',bar2:'#2563EB',icon:'fa-hourglass-half'},
    reject:{title:'资质认证未通过，请修改资料后重新提交',sub:'报价与政策申报暂不可用 · 按驳回原因修改后可重提',btn:'重新提交',bg:'#FEF2F2',bd:'#FECACA',fg:'#B91C1C',sub2:'#DC2626',bar:'#EF4444',bar2:'#DC2626',icon:'fa-circle-xmark'},
    expired:{title:'资质已于 '+d+' 过期，请上传新证完成复核',sub:'报价与政策申报已受限，运营端已发起到期处理',btn:'上传新证',bg:'#FEF2F2',bd:'#FECACA',fg:'#B91C1C',sub2:'#DC2626',bar:'#EF4444',bar2:'#B91C1C',icon:'fa-circle-exclamation'},
    invalid:{title:'资质已失效（到期不再续期），如需恢复请联系平台',sub:'询价 / 政策申报已受限 · 需重新入驻认证后恢复',btn:'联系平台',bg:'#F8FAFC',bd:'#E2E8F0',fg:'#475569',sub2:'#64748B',bar:'#94A3B8',bar2:'#64748B',icon:'fa-ban'}
  };
  return G[s]||G.none;
}
/* 拦截「去报价」链接时的提示语 */
function yzBlockTip(s){
  return {
    expired:'资质已过期，报价与政策申报受限，请上传新证完成复核',
    invalid:'资质已失效，如需恢复请联系平台重新入驻认证',
    reject:'资质认证未通过，请修改资料后重新提交',
    reviewing:'资质审核中，通过后即可查看供需详情并参与询价'
  }[s]||'报价权限随入驻默认开通；资质待复核将冻结受限品类询价';
}
