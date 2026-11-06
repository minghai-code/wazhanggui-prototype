/* AI 服务助手 · 全局悬浮球
 * 用法：在需要展示悬浮球的页面加一行 <script src="../shared/ai-fab.js"></script>
 * 删掉该行即完全消失，不影响页面其它部分。
 * 位置：右下，避让底部 Tab（65px）与商品详情购买栏。
 */
(function () {
  if (/ai-assistant\.html/.test(location.pathname)) return;
  if (document.getElementById('aiFab')) return;

  var css = ''
    + '#aiFab{position:fixed;right:14px;bottom:150px;z-index:90;width:52px;height:52px;border-radius:50%;'
    + 'background:linear-gradient(135deg,#FF6B35 0%,#FF4D2D 55%,#FF2D78 100%);'
    + 'box-shadow:0 8px 22px rgba(255,77,45,.42);display:flex;align-items:center;justify-content:center;'
    + 'color:#fff;font-size:19px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .16s}'
    + '#aiFab:active{transform:scale(.92)}'
    + '#aiFab .fab-badge{position:absolute;top:-3px;right:-2px;background:#1F2430;color:#fff;font-size:8px;'
    + 'font-weight:700;padding:2px 4px;border-radius:6px;letter-spacing:.3px;font-family:-apple-system,sans-serif}'
    + '#aiFab .fab-tip{position:absolute;right:58px;top:50%;transform:translateY(-50%);white-space:nowrap;'
    + 'background:rgba(31,36,48,.9);color:#fff;font-size:10.5px;padding:5px 9px;border-radius:8px;'
    + 'opacity:0;transition:opacity .25s;pointer-events:none}'
    + '#aiFab:hover .fab-tip{opacity:1}'
    + '@media (max-height:640px){#aiFab{bottom:130px}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var el = document.createElement('div');
  el.id = 'aiFab';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', 'AI 服务助手');
  el.innerHTML = '<span class="fab-tip">有问题？问小助手</span>'
    + '<i class="fas fa-wand-magic-sparkles"></i><span class="fab-badge">AI</span>';
  el.onclick = function () { location.href = 'ai-assistant.html'; };
  document.body.appendChild(el);
})();
