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
    gateE:{ax:.662,ay:.455,icon:'fa-ticket-simple',name:'东门道闸',rows:[['今日进出车辆','3,412 辆'],['当前通行','12 辆/分'],['设备状态','在线']]},
    gateS:{ax:.525,ay:.721,icon:'fa-ticket-simple',name:'南门道闸',rows:[['今日进出车辆','2,208 辆'],['当前通行','8 辆/分'],['设备状态','在线']]},
    gateW:{ax:.35,ay:.455,icon:'fa-ticket-simple',name:'西门道闸',rows:[['今日进出车辆','1,760 辆'],['当前通行','5 辆/分'],['设备状态','离线维修']]},
    camA:{ax:.45,ay:.36,icon:'fa-video',name:'高清监控 A-07',rows:[['在线状态','在线'],['今日告警','0 起'],['点位','袜业城 1F 主通道']]},
    camB:{ax:.612,ay:.5,icon:'fa-video',name:'高清监控 B-12',rows:[['在线状态','在线'],['今日告警','1 起'],['点位','市场东广场']]},
    smokeA:{ax:.425,ay:.548,icon:'fa-fire-extinguisher',name:'烟感探测 S-21',rows:[['状态','正常'],['最近报警','07-21 14:22']]},
    smokeB:{ax:.588,ay:.67,icon:'fa-fire-extinguisher',name:'温感探测 W-08',rows:[['状态','正常'],['最近报警','—']]},
    expo:{ax:.372,ay:.364,icon:'fa-flag',name:'袜博会展馆',rows:[['本届参展商','486 家'],['参观登记','3.2 万人'],['签单金额','4.6 亿元']]},
    ware:{ax:.72,ay:.75,icon:'fa-warehouse',name:'云仓 / 共享仓',rows:[['仓储面积','18.6 万㎡'],['库容利用率','82.4%'],['今日出入库','9,680 单']]},
    live:{ax:.6,ay:.629,icon:'fa-tower-broadcast',name:'直播基地',rows:[['今日直播','86 场'],['在线观看','5.2 万人'],['带货成交','¥ 236 万']]}
  };

  function buildPark2D(el,cb){
    var root=el.closest('.park3d')||el.parentElement;
    function blk(x,y,w,h,name){ /* 周边弱化建筑 */
      return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="rgba(148,163,184,.055)" stroke="rgba(148,163,184,.13)"/>'+
        '<text x="'+(x+w/2)+'" y="'+(y+h/2+4)+'" fill="#5b6c8c" font-size="11.5" text-anchor="middle">'+name+'</text>';
    }
    function road(x,y,w,h){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#1e3663"/>';}
    function dot(cx,cy,color,key,ring){
      var s='';
      if(ring)s+='<circle class="pp-ring" data-point="'+key+'" cx="'+cx+'" cy="'+cy+'" r="7" fill="none" stroke="'+color+'"/>';
      s+='<circle class="p3d-hit" data-point="'+key+'" cx="'+cx+'" cy="'+cy+'" r="4.5" fill="'+color+'" stroke="#0a1a3a" stroke-width="1.5"/>';
      return s;
    }
    var s='<rect width="1000" height="660" fill="#0a1a3a"/>';
    /* 道路网（参照大唐袜业实景：西三环路纵贯，网格街区） */
    s+=road(332,0,16,660);
    s+=road(0,170,1000,13);
    s+=road(0,470,1000,13);
    s+=road(0,540,1000,11);
    s+=road(650,183,11,477);
    s+=road(790,183,10,477);
    s+='<text x="324" y="140" fill="#51617f" font-size="13" font-style="italic" text-anchor="middle" transform="rotate(-90 324 140)">西  三  环  路</text>';
    /* 西三路以西 */
    s+=blk(50,40,250,95,'诸暨市快递拨发中心');
    s+=blk(50,205,240,85,'车海洋 24h 自助洗车');
    s+=blk(50,315,240,90,'诸暨市行政服务中心');
    s+=blk(50,420,240,90,'亿力商务');
    s+=blk(50,565,240,70,'方田新村');
    /* 北侧街区 */
    s+=blk(360,40,140,85,'国际袜都财富中心');
    s+=blk(520,40,120,85,'大唐金座');
    s+=blk(665,40,110,85,'锦绣商城');
    s+=blk(800,40,150,85,'兴盛精品公寓');
    /* 园区主体：大唐袜业市场（点击看数据） */
    s+='<rect class="p3d-hit" data-building="woolcity" x="395" y="212" width="245" height="175" rx="14" fill="rgba(34,211,238,.06)" stroke="rgba(34,211,238,.55)" stroke-width="1.6"/>';
    s+='<text x="517" y="250" fill="#e6eef9" font-size="13" font-weight="700" text-anchor="middle">大唐袜业市场</text>';
    s+='<text x="517" y="266" fill="#8fb8cc" font-size="10" text-anchor="middle">港阳大厦 · 袜业市场</text>';
    s+='<circle cx="517" cy="286" r="10" fill="rgba(248,113,113,.25)"/><circle cx="517" cy="286" r="4.5" fill="#f87171"/>';
    s+='<text x="428" y="330" fill="#6f86a6" font-size="10">袜都店</text>';
    s+='<text x="560" y="330" fill="#6f86a6" font-size="10">大唐袜优品专卖</text>';
    s+='<text x="517" y="206" fill="#9fb0c8" font-size="10.5" text-anchor="middle">北门 · 入口</text>';
    /* 电商园 */
    s+='<rect x="400" y="400" width="235" height="66" rx="10" fill="rgba(34,211,238,.10)" stroke="rgba(34,211,238,.3)"/>';
    s+='<text x="517" y="428" fill="#bfe9f5" font-size="12.5" font-weight="700" text-anchor="middle">大唐袜业电商园</text>';
    s+='<text x="517" y="446" fill="#6f86a6" font-size="9.5" text-anchor="middle">直播基地 · 优品专卖</text>';
    /* 法院 */
    s+=blk(400,484,235,46,'诸暨市人民法院 · 共富服务站');
    /* 市场东侧街区 */
    s+=blk(663,212,124,70,'包江印刷');
    s+=blk(663,300,124,70,'泡泡公寓');
    s+=blk(663,388,124,70,'交通银行');
    s+=blk(800,212,150,70,'车吧 24h 洗车');
    s+=blk(800,300,150,70,'华莱士 · 汉堡');
    s+=blk(800,388,150,70,'金莱怡针织制线');
    s+=blk(800,476,150,54,'上港口新村');
    /* 原料市场（浙江大唐轻纺袜业城 A/B 区，点击看数据） */
    s+='<rect class="p3d-hit" data-building="yuanliao" x="430" y="563" width="230" height="72" rx="10" fill="rgba(167,139,250,.09)" stroke="rgba(167,139,250,.55)" stroke-width="1.4"/>';
    s+='<text x="545" y="592" fill="#cdbcfa" font-size="12" font-weight="700" text-anchor="middle">浙江大唐轻纺袜业城 A / B 区</text>';
    s+='<text x="545" y="611" fill="#7d6fae" font-size="9.5" text-anchor="middle">原料市场 · 棉纱 / 化纤 / 辅料</text>';
    s+=blk(160,565,120,68,'横店电影城');
    s+=blk(300,565,110,68,'永茂广场');
    s+=blk(680,565,120,68,'中国工商银行');
    s+=blk(820,565,120,68,'中国银行');
    /* 门 */
    s+='<text x="350" y="284" fill="#9fb0c8" font-size="10" text-anchor="middle">西门</text>';
    s+='<text x="662" y="284" fill="#9fb0c8" font-size="10" text-anchor="middle">东门</text>';
    s+='<text x="556" y="480" fill="#9fb0c8" font-size="10">南门</text>';
    /* 点位：道闸 */
    s+=dot(350,300,'#f87171','gateW',true)+dot(662,300,'#f87171','gateE',true)+dot(525,476,'#f87171','gateS',true);
    /* 监控 / 烟感 */
    s+=dot(450,238,'#22d3ee','camA',true)+dot(612,330,'#22d3ee','camB',true);
    s+=dot(425,362,'#fbbf24','smokeA',true)+dot(588,442,'#fbbf24','smokeB',true);
    /* 展馆 / 云仓 / 直播 */
    s+=dot(372,240,'#fbbf24','expo',true);
    s+='<text x="372" y="260" fill="#e8cf90" font-size="10" text-anchor="middle">袜博会展馆</text>';
    s+=dot(720,495,'#34d399','ware',true);
    s+='<text x="720" y="515" fill="#9fe0c6" font-size="10" text-anchor="middle">云仓/共享仓</text>';
    s+=dot(600,415,'#60a5fa','live',true);
    el.innerHTML='<svg viewBox="0 0 1000 660" preserveAspectRatio="xMidYMid slice">'+s+'</svg>';

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
