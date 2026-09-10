/* ============================================================
   驾驶舱大屏 · 共享运行时 v2.1
   头部/时钟/四角框 + 2D 园区地图（高德深色风格） + 专题弹窗框架
   注：3D 园区地图备用方案已迁移至 map-3d.js / map-3d-demo.html
   ============================================================ */
(function(){
  /* ---------- 实时时钟 ---------- */
  function pad(n){return n<10?'0'+n:''+n}
  function startClock(){
    function tick(){
      var d=new Date();
      var w=['日','一','二','三','四','五','六'][d.getDay()];
      var dt=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' 星期'+w;
      var tm=pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
      document.querySelectorAll('.ck-date').forEach(function(e){e.textContent=dt;});
      document.querySelectorAll('.ck-time').forEach(function(e){e.textContent=tm;});
    }
    tick();setInterval(tick,1000);
  }
  /* ---------- 四角装饰框 ---------- */
  function corners(){
    if(document.querySelector('.corner'))return;
    ['tl','tr','bl','br'].forEach(function(c){
      var s=document.createElement('span');s.className='corner '+c;document.body.appendChild(s);
    });
  }
  /* ---------- 标题栏：左上返回总门户 / 名称居中 / 时间最右 ---------- */
  function renderHead(title,icon,sub,home){
    var h=document.querySelector('.cockpit-head');if(!h)return;
    if(home===undefined)home='../index.html';
    var left=home?'<a class="ck-home" href="'+home+'" target="_top" title="返回总门户">'+
      '<i class="fa-solid fa-arrow-left"></i>&nbsp;返回总门户</a>':'';
    h.innerHTML='<div class="ck-left">'+left+'</div>'+
      '<div class="ck-center"><div class="ck-title"><i class="fa-solid '+icon+'"></i>'+title+'</div></div>'+
      '<div class="ck-meta"><span class="ck-date"></span><span class="ck-time"></span></div>';
  }

  /* ============================================================
     2D 园区地图（高德深色风格）
     cb = { onBuilding(id,floor), onPoint(key,anchor) }
     返回 { focus(id), reset(), setFloor() }
     ============================================================ */
  var POINTS={
    gateE:{ax:.672,ay:.552,icon:'fa-ticket-simple',name:'东门道闸',rows:[['今日进出车辆','3,412 辆'],['当前通行','12 辆/分'],['设备状态','在线']]},
    gateS:{ax:.502,ay:.762,icon:'fa-ticket-simple',name:'南门道闸',rows:[['今日进出车辆','2,208 辆'],['当前通行','8 辆/分'],['设备状态','在线']]},
    gateW:{ax:.328,ay:.552,icon:'fa-ticket-simple',name:'西门道闸',rows:[['今日进出车辆','1,760 辆'],['当前通行','5 辆/分'],['设备状态','离线维修']]},
    camA:{ax:.455,ay:.418,icon:'fa-video',name:'高清监控 A-07',rows:[['在线状态','在线'],['今日告警','0 起'],['点位','袜业城 1F 主通道']]},
    camB:{ax:.602,ay:.498,icon:'fa-video',name:'高清监控 B-12',rows:[['在线状态','在线'],['今日告警','1 起'],['点位','市场东广场']]},
    smokeA:{ax:.415,ay:.612,icon:'fa-fire-extinguisher',name:'烟感探测 S-21',rows:[['状态','正常'],['最近报警','07-21 14:22']]},
    smokeB:{ax:.557,ay:.70,icon:'fa-fire-extinguisher',name:'温感探测 W-08',rows:[['状态','正常'],['最近报警','—']]},
    expo:{ax:.382,ay:.485,icon:'fa-flag',name:'袜博会展馆',rows:[['本届参展商','486 家'],['参观登记','3.2 万人'],['签单金额','4.6 亿元']]},
    ware:{ax:.722,ay:.695,icon:'fa-warehouse',name:'云仓 / 共享仓',rows:[['仓储面积','18.6 万㎡'],['库容利用率','82.4%'],['今日出入库','9,680 单']]},
    live:{ax:.587,ay:.568,icon:'fa-tower-broadcast',name:'直播基地',rows:[['今日直播','86 场'],['在线观看','5.2 万人'],['带货成交','¥ 236 万']]}
  };

  function buildPark2D(el,cb){
    var root=el.closest('.park3d')||el.parentElement;
    function blk(x,y,w,h,name){ /* 周边弱化建筑 */
      return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="rgba(148,163,184,.055)" stroke="rgba(148,163,184,.13)"/>'+
        '<text x="'+(x+w/2)+'" y="'+(y+h/2+4)+'" fill="#5b6c8c" font-size="11.5" text-anchor="middle">'+name+'</text>';
    }
    function road(x,y,w,h){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#1b2941"/>';}
    function dot(cx,cy,color,key,ring){
      var s='';
      if(ring)s+='<circle class="pp-ring" cx="'+cx+'" cy="'+cy+'" r="7" fill="none" stroke="'+color+'"/>';
      s+='<circle class="p3d-hit" data-point="'+key+'" cx="'+cx+'" cy="'+cy+'" r="4.5" fill="'+color+'" stroke="#0b1526" stroke-width="1.5"/>';
      return s;
    }
    var s='<rect width="1000" height="620" fill="#0b1526"/>';
    /* 道路网 */
    s+=road(0,196,1000,14)+road(0,470,1000,14)+road(0,540,1000,10);
    s+=road(312,0,14,620)+road(674,0,14,620)+road(770,0,10,620);
    s+='<text x="880" y="534" fill="#51617f" font-size="13" font-style="italic">开 明 路</text>';
    s+='<text x="20" y="190" fill="#51617f" font-size="12" font-style="italic">市场大道</text>';
    /* 周边弱化建筑（参照大唐袜业城实景） */
    s+=blk(40,40,200,120,'弘隆针织')+blk(260,30,120,130,'袜都店')+blk(395,30,170,110,'国际袜都财富中心');
    s+=blk(600,40,150,110,'大唐金座')+blk(790,40,170,110,'锦织商场');
    s+=blk(40,240,220,110,'农口超市 / 天天顺')+blk(40,380,230,80,'车海洋 24h 自助洗车');
    s+=blk(740,240,240,110,'长安包装材料');
    s+=blk(790,490,180,42,'新丝维染色')+blk(790,556,180,52,'交通银行');
    s+=blk(240,558,220,50,'浙江大唐袜业城有限公司')+blk(470,558,200,50,'袜业城行政服务中心');
    s+=blk(690,558,80,50,'市场百货')+blk(120,558,100,50,'19 幢');
    /* 园区主体：大唐袜业市场 */
    s+='<rect class="p3d-hit" data-building="woolcity" x="345" y="225" width="310" height="235" rx="16" fill="rgba(34,211,238,.06)" stroke="rgba(34,211,238,.55)" stroke-width="1.6"/>';
    s+='<rect x="420" y="242" width="120" height="40" rx="6" fill="rgba(34,211,238,.13)"/>';
    s+='<text x="480" y="266" fill="#bfe9f5" font-size="12" text-anchor="middle">袜 都 店</text>';
    s+='<text x="545" y="286" fill="#8fb8cc" font-size="11" text-anchor="middle">大唐袜优品专卖</text>';
    s+='<rect x="395" y="325" width="215" height="95" rx="8" fill="rgba(34,211,238,.10)" stroke="rgba(34,211,238,.25)"/>';
    s+='<text x="502" y="368" fill="#bfe9f5" font-size="13" font-weight="700" text-anchor="middle">大唐袜都电商园</text>';
    s+='<text x="428" y="448" fill="#6f86a6" font-size="11">百织袜业</text>';
    s+='<text x="586" y="440" fill="#6f86a6" font-size="11">国家电网充电站</text>';
    /* 中心地标 */
    s+='<text x="500" y="292" fill="#e6eef9" font-size="11.5" font-weight="700" text-anchor="middle">大唐袜业市场</text>';
    s+='<circle cx="500" cy="308" r="10" fill="rgba(248,113,113,.25)"/><circle cx="500" cy="308" r="4.5" fill="#f87171"/>';
    /* 原料市场 */
    s+='<rect class="p3d-hit" data-building="yuanliao" x="800" y="365" width="150" height="80" rx="10" fill="rgba(167,139,250,.09)" stroke="rgba(167,139,250,.55)" stroke-width="1.4"/>';
    s+='<text x="875" y="400" fill="#cdbcfa" font-size="12.5" font-weight="700" text-anchor="middle">原 料 市 场</text>';
    s+='<text x="875" y="418" fill="#7d6fae" font-size="10" text-anchor="middle">棉纱 · 化纤 · 辅料</text>';
    /* 门 */
    s+='<text x="500" y="216" fill="#9fb0c8" font-size="11" text-anchor="middle">北门 · 入口</text>';
    s+='<text x="352" y="345" fill="#9fb0c8" font-size="11">西门</text>';
    s+='<text x="628" y="345" fill="#9fb0c8" font-size="11">东门</text>';
    s+='<text x="490" y="462" fill="#9fb0c8" font-size="11">南门</text>';
    /* 点位：道闸 */
    s+=dot(672,340,'#f87171','gateE',true)+dot(500,468,'#f87171','gateS',true)+dot(328,340,'#f87171','gateW',true);
    /* 监控 / 烟感 */
    s+=dot(455,260,'#22d3ee','camA',true)+dot(602,308,'#22d3ee','camB',true);
    s+=dot(415,380,'#fbbf24','smokeA',true)+dot(557,436,'#fbbf24','smokeB',true);
    /* 展馆 / 云仓 / 直播 */
    s+=dot(382,302,'#fbbf24','expo',true);
    s+='<text x="382" y="322" fill="#e8cf90" font-size="10" text-anchor="middle">袜博会展馆</text>';
    s+=dot(722,428,'#34d399','ware',true);
    s+='<text x="722" y="448" fill="#9fe0c6" font-size="10" text-anchor="middle">云仓/共享仓</text>';
    s+=dot(587,352,'#60a5fa','live',true);
    s+='<text x="587" y="372" fill="#a9c6ef" font-size="10" text-anchor="middle">直播基地</text>';
    el.innerHTML='<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet">'+s+'</svg>';

    el.querySelectorAll('[data-building]').forEach(function(n){
      n.addEventListener('click',function(e){
        e.stopPropagation();
        if(cb.onBuilding)cb.onBuilding(n.getAttribute('data-building'),n.getAttribute('data-floor'));
      });
    });
    el.querySelectorAll('[data-point]').forEach(function(n){
      n.addEventListener('click',function(e){
        e.stopPropagation();
        var key=n.getAttribute('data-point');
        if(cb.onPoint)cb.onPoint(key,[POINTS[key].ax,POINTS[key].ay]);
      });
    });

    var api={};
    api.focus=function(id){ /* 2D：高亮选中区块 */
      el.querySelectorAll('.fl-on').forEach(function(n){n.classList.remove('fl-on');});
      el.querySelectorAll('[data-building="'+id+'"]').forEach(function(n){n.classList.add('fl-on');});
      root.classList.add('focused');
    };
    api.reset=function(){
      el.querySelectorAll('.fl-on').forEach(function(n){n.classList.remove('fl-on');});
      root.classList.remove('focused');
    };
    api.setFloor=function(){ /* 2D 无楼层透视，保留接口兼容 */ };
    return api;
  }

  /* ============================================================
     专题弹窗框架
     ============================================================ */
  var modalApi=null;
  function modalOpen(opt){
    modalClose();
    var mask=document.createElement('div');mask.className='topic-mask show';
    mask.innerHTML='<div class="topic-modal" style="--tmc:'+(opt.color||'#22d3ee')+'">'+
      '<div class="tm-head"><div class="tm-title"><i class="fa-solid '+(opt.icon||'fa-chart-line')+'"></i>'+opt.title+'</div>'+
      '<div class="tm-sub">'+(opt.sub||'')+'</div><div class="tm-pills"></div>'+
      '<button class="tm-close" title="关闭"><i class="fa-solid fa-xmark"></i></button></div>'+
      '<div class="tm-body"></div></div>';
    document.body.appendChild(mask);
    var body=mask.querySelector('.tm-body'),pills=mask.querySelector('.tm-pills');
    (opt.ranges||['今日','近7天','近30天','本年']).forEach(function(r){
      var p=document.createElement('span');
      p.className='pill'+((opt.range||'近7天')===r?' on':'');p.textContent=r;
      p.onclick=function(){
        pills.querySelectorAll('.pill').forEach(function(x){x.classList.remove('on');});
        p.classList.add('on');
        if(opt.onRange)opt.onRange(r);
      };
      pills.appendChild(p);
    });
    var api={body:body,mask:mask,close:modalClose};
    mask.querySelector('.tm-close').onclick=modalClose;
    mask.addEventListener('click',function(e){if(e.target===mask)modalClose();});
    modalApi={mask:mask,onClose:opt.onClose};
    if(opt.onBuild)opt.onBuild(body,opt.range||'近7天');
    return api;
  }
  function modalClose(){
    if(!modalApi)return;
    if(modalApi.onClose)try{modalApi.onClose();}catch(e){}
    modalApi.mask.remove();modalApi=null;
  }

  window.Cockpit={startClock:startClock,corners:corners,renderHead:renderHead,
    buildPark2D:buildPark2D,modalOpen:modalOpen,modalClose:modalClose,POINTS:POINTS};
  if(document.readyState!=='loading'){corners();startClock();}
  else document.addEventListener('DOMContentLoaded',function(){corners();startClock();});
})();
