/* ============================================================
   驾驶舱大屏 · 共享运行时（标题栏 / 时钟 / 四角框 / 园区·车间图）
   传统"包夹式"驾驶舱：中央地图 + 四周环绕面板
   ============================================================ */
(function(){
  /* 实时时钟 */
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
  /* 四角装饰框 */
  function corners(){
    if(document.querySelector('.corner'))return;
    ['tl','tr','bl','br'].forEach(function(c){
      var s=document.createElement('span');s.className='corner '+c;document.body.appendChild(s);
    });
  }
  /* 标题栏渲染：名称居中、时间最右、左上四主题切换（原首页按钮） */
  function renderHead(title,icon,sub,page){
    var h=document.querySelector('.cockpit-head');if(!h)return;
    var items=[['overview.html','总览'],['theme-industry.html','智慧产业'],
      ['theme-trade.html','在线交易'],['theme-governance.html','智慧治理'],['theme-factory.html','智慧工厂']];
    var nav='<div class="ck-nav">'+items.map(function(it){
      return '<a class="ck-nav-btn'+(it[0]===page?' active':'')+'" href="'+it[0]+'">'+it[1]+'</a>';
    }).join('')+'</div>';
    h.innerHTML='<div class="ck-left">'+nav+'</div>'+
      '<div class="ck-center"><div class="ck-title"><i class="fa-solid '+icon+'"></i>'+title+'</div></div>'+
      '<div class="ck-meta"><span class="ck-date"></span><span class="ck-time"></span></div>';
  }

  /* 园区 / 市场布局图（蓝图风格 SVG，可叠加 HTML 标记） */
  function parkMap(){
    var b=[
      [60,60,200,120,'交易市场 A区',0],
      [740,60,200,120,'交易市场 B区',0],
      [60,300,200,140,'原料集散中心',0],
      [740,300,200,140,'物流仓储中心',0],
      [400,200,200,120,'数据中心 / 指挥中心',1],
      [300,420,200,120,'智造工厂区',0],
      [500,420,200,120,'直播电商基地',0]
    ];
    var roads='M500 260 L160 120 M500 260 L840 120 M500 260 L160 370 M500 260 L840 370 M500 260 L400 480 M500 260 L600 480';
    var bs=b.map(function(x){
      var cx=x[0]+x[2]/2, cy=x[1]+x[3]/2;
      var fill=x[5]?'rgba(34,211,238,.18)':'rgba(22,32,54,.6)';
      var stroke=x[5]?'rgba(34,211,238,.8)':'rgba(34,211,238,.42)';
      var fs=x[4].length>6?15:17;
      return '<rect x="'+x[0]+'" y="'+x[1]+'" width="'+x[2]+'" height="'+x[3]+'" rx="12" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>'+
        '<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="middle" fill="#dbe6f5" font-size="'+fs+'" font-weight="700">'+x[4]+'</text>';
    }).join('');
    return '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">'+
      '<defs><pattern id="pg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/></pattern>'+
      '<radialGradient id="cg" cx="50%" cy="46%" r="55%"><stop offset="0%" stop-color="rgba(34,211,238,.16)"/><stop offset="100%" stop-color="rgba(34,211,238,0)"/></radialGradient></defs>'+
      '<rect width="1000" height="560" fill="url(#pg)"/><rect width="1000" height="560" fill="url(#cg)"/>'+
      '<g stroke="rgba(167,139,250,.4)" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" fill="none"><path d="'+roads+'"/></g>'+
      bs+'</svg>';
  }

  /* 车间 / 产线布局图（机台状态点） */
  function workshopMap(){
    var rows=[70,185,300,415];
    var names=['1 号智造产线','2 号智造产线','3 号智造产线','4 号智造产线'];
    var amber=[2,1,1,3], red=[6,7,7,-1], blue=[-1,4,-1,5];
    var C={g:['rgba(52,211,153,.18)','#34d399'],a:['rgba(251,191,36,.2)','#fbbf24'],r:['rgba(248,113,113,.2)','#f87171'],b:['rgba(96,165,250,.2)','#60a5fa']};
    var s='';
    rows.forEach(function(ry,i){
      s+='<rect x="60" y="'+(ry-8)+'" width="884" height="96" rx="10" fill="rgba(255,255,255,.03)" stroke="rgba(34,211,238,.18)"/>';
      s+='<text x="74" y="'+(ry+42)+'" fill="#9fb0c8" font-size="13" font-weight="700">'+names[i]+'</text>';
      for(var c=0;c<8;c++){
        var x=180+c*98, y=ry+12, w=82, h=60, k='g';
        if(c===amber[i])k='a'; else if(c===red[i])k='r'; else if(c===blue[i])k='b';
        s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="'+C[k][0]+'" stroke="'+C[k][1]+'" stroke-width="1.5"/>';
        s+='<text x="'+(x+w/2)+'" y="'+(y+h/2)+'" text-anchor="middle" dominant-baseline="middle" fill="#dbe6f5" font-size="12" font-weight="700">M'+(c+1)+'</text>';
      }
    });
    return '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">'+
      '<defs><pattern id="wg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="1"/></pattern></defs>'+
      '<rect width="1000" height="560" fill="url(#wg)"/>'+s+'</svg>';
  }

  /* 在地图容器上叠加脉冲标记 list:[[left%,top%,color,title,desc],...] */
  function addMarkers(el,list){
    if(!el)return;
    list.forEach(function(m){
      var d=document.createElement('div');d.className='map-node';
      d.style.left=m[0];d.style.top=m[1];d.style.setProperty('--mc',m[2]);
      d.innerHTML='<span class="ring"></span><span class="mn-pop"><b>'+m[3]+'</b>'+m[4]+'</span>';
      el.appendChild(d);
    });
  }

  window.Cockpit={startClock:startClock,corners:corners,renderHead:renderHead,parkMap:parkMap,workshopMap:workshopMap,addMarkers:addMarkers};
  if(document.readyState!=='loading'){corners();startClock();}
  else document.addEventListener('DOMContentLoaded',function(){corners();startClock();});
})();
