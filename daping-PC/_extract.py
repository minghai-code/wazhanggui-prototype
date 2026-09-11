import re
h=open('overview.html',encoding='utf-8').read()
ss=re.findall(r'<script>(.*?)</script>',h,re.S)
main=[s for s in ss if 'Cockpit.renderHead' in s][0]
main=main+'''
;(function(){try{
  var b=document.createElement('div');
  TOPICS.ai.build(b,'近7天');
  var has=b.innerHTML.indexOf('袜品潮流趋势分析')>=0;
  var imgs=(b.innerHTML.match(/placehold\\.co/g)||[]).length;
  console.log('AI_BUILD_OK len='+b.innerHTML.length+' hasPhotoTitle='+has+' imgs='+imgs);
}catch(e){console.log('AI_BUILD_ERR '+e.message);}})();'''
open('_chk.js','w',encoding='utf-8').write(main)
s=open('_stub.js',encoding='utf-8').read()
if 'document.write' not in s:
    s=s.replace('global.addEventListener=function(){};',
                'global.addEventListener=function(){};global.document.write=function(){};')
    open('_stub.js','w',encoding='utf-8').write(s)
print('extracted')
