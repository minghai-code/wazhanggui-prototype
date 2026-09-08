/* ============================================================
   驾驶舱大屏 · 共享运行时 v2.0
   头部/时钟/四角框 + 2.5D 等轴测园区图 + 专题弹窗框架
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
  /* ---------- 标题栏：名称居中、时间最右 ---------- */
  function renderHead(title,icon,sub){
    var h=document.querySelector('.cockpit-head');if(!h)return;
    h.innerHTML='<div class="ck-left"></div>'+
      '<div class="ck-center"><div class="ck-title"><i class="fa-solid '+icon+'"></i>'+title+'</div></div>'+
      '<div class="ck-meta"><span class="ck-date"></span><span class="ck-time"></span></div>';
  }

  /* ============================================================
     2.5D 等轴测园区图
     ============================================================ */
  function P(x,y){return (+x).toFixed(1)+','+(+y).toFixed(1);}
  /* 等轴测长方体：(x,y)为底面后角，W 沿右轴、D 沿左轴、H 高 */
  function isoBox(x,y,W,D,H,top,left,right,extra){
    var Ax=x+W,Ay=y+W*.5,Bx=x+W-D,By=y+(W+D)*.5,Cx=x-D,Cy=y+D*.5;
    return '<polygon points="'+P(x,y-H)+' '+P(Ax,Ay-H)+' '+P(Bx,By-H)+' '+P(Cx,Cy-H)+'" fill="'+top+'" '+(extra||'')+'/>'+
      '<polygon points="'+P(Ax,Ay-H)+' '+P(Bx,By-H)+' '+P(Bx,By)+' '+P(Ax,Ay)+'" fill="'+right+'"/>'+
      '<polygon points="'+P(Cx,Cy-H)+' '+P(Bx,By-H)+' '+P(Bx,By)+' '+P(Cx,Cy)+'" fill="'+left+'"/>';
  }

  var BUILD_CENTERS={woolcity:[400,255],yuanliao:[705,375]};
  var POINTS={
    gateE:{ax:.905,ay:.53,icon:'fa-ticket-simple',name:'东门道闸',rows:[['今日进出车辆','3,412 辆'],['当前通行','12 辆/分'],['设备状态','在线']]},
    gateS:{ax:.50,ay:.765,icon:'fa-ticket-simple',name:'南门道闸',rows:[['今日进出车辆','2,208 辆'],['当前通行','8 辆/分'],['设备状态','在线']]},
    gateW:{ax:.095,ay:.48,icon:'fa-ticket-simple',name:'西门道闸',rows:[['今日进出车辆','1,760 辆'],['当前通行','5 辆/分'],['设备状态','离线维修']]},
    camA:{ax:.43,ay:.27,icon:'fa-video',name:'高清监控 A-07',rows:[['在线状态','在线'],['今日告警','0 起'],['点位','袜业城 1F 主通道']]},
    camB:{ax:.655,ay:.385,icon:'fa-video',name:'高清监控 B-12',rows:[['在线状态','在线'],['今日告警','1 起'],['点位','原料市场东广场']]},
    smokeA:{ax:.465,ay:.355,icon:'fa-fire-extinguisher',name:'烟感探测 S-21',rows:[['状态','正常'],['最近报警','07-21 14:22']]},
    smokeB:{ax:.615,ay:.485,icon:'fa-fire-extinguisher',name:'温感探测 W-08',rows:[['状态','正常'],['最近报警','—']]},
    expo:{ax:.19,ay:.50,icon:'fa-flag',name:'袜博会展馆',rows:[['本届参展商','486 家'],['参观登记','3.2 万人'],['签单金额','4.6 亿元']]},
    ware:{ax:.54,ay:.665,icon:'fa-warehouse',name:'云仓 / 共享仓',rows:[['仓储面积','18.6 万㎡'],['库容利用率','82.4%'],['今日出入库','9,680 单']]},
    live:{ax:.26,ay:.665,icon:'fa-tower-broadcast',name:'直播基地',rows:[['今日直播','86 场'],['在线观看','5.2 万人'],['带货成交','¥ 236 万']]}
  };

  /* 构建 3D 园区图：cb = {onBuilding(id,floor), onPoint(key)}；返回 {focus,reset,setFloor} */
  function buildPark3D(el,cb){
    var root=el.closest('.park3d')||el.parentElement;
    var s='';
    /* 地坪 */
    s+='<defs><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1830"/><stop offset="1" stop-color="#0a1224"/></linearGradient></defs>';
    s+='<polygon points="500,40 960,270 500,500 40,270" fill="url(#gd)" stroke="rgba(34,211,238,.35)" stroke-width="1.5"/>';
    s+='<polygon points="500,90 860,270 500,450 140,270" fill="none" stroke="rgba(34,211,238,.14)" stroke-width="1"/>';
    /* 道路 */
    s+='<polygon points="345,180 395,205 300,395 250,370" fill="rgba(255,255,255,.045)"/>';
    s+='<polygon points="395,205 660,340 610,365 345,230" fill="rgba(255,255,255,.04)"/>';
    /* 绿化 / 停车 */
    [[300,250],[330,280],[690,240],[720,410],[410,420]].forEach(function(t){
      s+='<ellipse cx="'+t[0]+'" cy="'+t[1]+'" rx="9" ry="5" fill="rgba(52,211,153,.35)"/><circle cx="'+t[0]+'" cy="'+(t[1]-6)+'" r="5" fill="rgba(52,211,153,.5)"/>';
    });
    s+='<polygon points="120,300 170,325 145,350 95,325" fill="rgba(96,165,250,.10)" stroke="rgba(96,165,250,.3)"/>';
    s+='<text x="133" y="330" fill="#5b6f8f" font-size="10" text-anchor="middle">停车场</text>';
    /* 袜业城（3 层，逐层客流热度） */
    var heat=[.55,.8,.68], FH=30, bx=370, by=195;
    for(var i=0;i<3;i++){
      var h=heat[i], y=by-i*FH;
      s+=isoBox(bx,y,250,210,FH,
        'rgba(34,211,238,'+(0.13+h*0.22)+')','rgba(9,64,84,.92)','rgba(13,90,115,'+(0.7+h*0.2)+')',
        'class="p3d-hit" data-building="woolcity" data-floor="'+i+'"');
      s+='<text x="'+(bx+160)+'" y="'+(y+ FH*.62 + (210-250)*0 )+'" fill="#bfe9f5" font-size="11" font-weight="700" opacity=".9">'+(i+1)+'F · 袜业城</text>';
    }
    s+='<text x="410" y="150" fill="#9fdcec" font-size="14" font-weight="800" text-anchor="middle">袜 业 城</text>';
    /* 原料市场 */
    s+=isoBox(690,315,190,150,42,'rgba(167,139,250,.30)','rgba(58,42,120,.95)','rgba(74,55,150,.9)','class="p3d-hit" data-building="yuanliao"');
    s+='<text x="800" y="272" fill="#cdbcfa" font-size="13" font-weight="800" text-anchor="middle">原料市场</text>';
    /* 展馆 / 云仓 / 直播基地 */
    s+=isoBox(180,255,110,90,30,'rgba(251,191,36,.22)','rgba(120,86,10,.9)','rgba(150,108,12,.85)','class="p3d-hit" data-point="expo"');
    s+='<text x="150" y="330" fill="#e8cf90" font-size="11" font-weight="700">袜博会展馆</text>';
    s+=isoBox(530,365,110,90,26,'rgba(52,211,153,.20)','rgba(16,90,66,.9)','rgba(20,110,80,.85)','class="p3d-hit" data-point="ware"');
    s+='<text x="540" y="435" fill="#9fe0c6" font-size="11" font-weight="700">云仓/共享仓</text>';
    s+=isoBox(250,370,100,80,24,'rgba(96,165,250,.20)','rgba(24,58,110,.9)','rgba(30,70,130,.85)','class="p3d-hit" data-point="live"');
    s+='<text x="255" y="435" fill="#a9c6ef" font-size="11" font-weight="700">直播基地</text>';
    /* 道闸 */
    [['gateE',880,300],['gateS',480,455],['gateW',80,285]].forEach(function(g){
      s+=isoBox(g[1],g[2],34,26,9,'rgba(248,113,113,.35)','rgba(110,35,35,.9)','rgba(140,45,45,.85)','class="p3d-hit" data-point="'+g[0]+'"');
    });
    s+='<text x="880" y="335" fill="#f0a5a5" font-size="10">东门</text>';
    s+='<text x="470" y="492" fill="#f0a5a5" font-size="10">南门</text>';
    s+='<text x="70" y="322" fill="#f0a5a5" font-size="10">西门</text>';
    /* 监控 / 烟感点位 */
    [['camA',430,175],['camB',655,235]].forEach(function(p){
      s+='<circle class="pp-ring" cx="'+p[1]+'" cy="'+p[2]+'" r="6" fill="none" stroke="#22d3ee"/>';
      s+='<circle class="p3d-hit" data-point="'+p[0]+'" cx="'+p[1]+'" cy="'+p[2]+'" r="4.5" fill="#22d3ee" stroke="#04202a"/>';
    });
    [['smokeA',465,225],['smokeB',615,300]].forEach(function(p){
      s+='<circle class="pp-ring" cx="'+p[1]+'" cy="'+p[2]+'" r="6" fill="none" stroke="#fbbf24"/>';
      s+='<circle class="p3d-hit" data-point="'+p[0]+'" cx="'+p[1]+'" cy="'+p[2]+'" r="4.5" fill="#fbbf24" stroke="#2a1c02"/>';
    });
    el.innerHTML='<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet"><g class="scene">'+s+'</g></svg>';
    var g=el.querySelector('g.scene');

    el.querySelectorAll('[data-building]').forEach(function(n){
      n.addEventListener('click',function(e){
        e.stopPropagation();
        if(cb.onBuilding)cb.onBuilding(n.getAttribute('data-building'),n.getAttribute('data-floor'));
      });
    });
    el.querySelectorAll('[data-point]').forEach(function(n){
      n.addEventListener('click',function(e){
        e.stopPropagation();
        if(cb.onPoint)cb.onPoint(n.getAttribute('data-point'));
      });
    });

    var curFloor=-1;
    function api(){}
    api.focus=function(id){
      var c=BUILD_CENTERS[id];if(!c)return;
      var k=1.9;
      g.style.transform='translate('+(500-k*c[0])+'px,'+(300-k*c[1])+'px) scale('+k+')';
      root.classList.add('focused');
    };
    api.reset=function(){
      g.style.transform='';root.classList.remove('focused');curFloor=-1;
      el.querySelectorAll('.fl-on').forEach(function(n){n.classList.remove('fl-on');});
    };
    api.setFloor=function(i){
      curFloor=i;
      el.querySelectorAll('.fl-on').forEach(function(n){n.classList.remove('fl-on');});
      if(i>=0)el.querySelectorAll('[data-floor="'+i+'"]').forEach(function(n){n.classList.add('fl-on');});
    };
    return api;
  }

  /* ============================================================
     专题弹窗框架
     ============================================================ */
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
  var modalApi=null;
  function modalClose(){
    if(!modalApi)return;
    if(modalApi.onClose)try{modalApi.onClose();}catch(e){}
    modalApi.mask.remove();modalApi=null;
  }

  window.Cockpit={startClock:startClock,corners:corners,renderHead:renderHead,
    buildPark3D:buildPark3D,modalOpen:modalOpen,modalClose:modalClose,POINTS:POINTS};
  if(document.readyState!=='loading'){corners();startClock();}
  else document.addEventListener('DOMContentLoaded',function(){corners();startClock();});
})();
