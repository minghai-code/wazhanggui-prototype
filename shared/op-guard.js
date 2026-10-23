/*
 * op-guard.js — 运营端原型「操作权限 / 并发冲突」演示守卫
 *
 * 作用：在原型页右上角放一个角色切换器，切换后点击越权操作会被拦截并提示。
 *       带 ?conflict=1 打开时，写操作会提示"已被他人修改"（演示乐观锁冲突）。
 *
 * 侵入性：页面只需末尾加一行 <script src="../shared/op-guard.js"></script>
 *         不改任何业务函数、不改按钮、不引入 CSS 文件（样式全部内联在本文件）。
 * 剥离：删掉本文件 + 页面那行 script → 原型完全恢复原样。
 */
(function () {
  'use strict';

  var ROLES = {
    lead:   { name: '运营主管',       perms: { audit: 1, write: 1 } },
    staff:  { name: '运营专员',       perms: { write: 1 } },
    viewer: { name: '只读（访客）',   perms: {} }
  };

  // 按页面文件名 + 按钮文字正则判定所需权限
  var RULES = {
    'merchant-auto.html':    [{ re: /立即同步|处理|忽略|重跑|转人工/, perm: 'write' }],
    'merchant-change.html':  [{ re: /审核|通过|驳回/, perm: 'audit' }],
    'merchant-profile.html': [{ re: /添加员工|解除关联|保存|补档|暂停|冻结|标签/, perm: 'write' }],
    'merchant-rating.html':  [{ re: /调整|重新计算|规则|保存/, perm: 'audit' }],
    'merchant-qual.html':    [{ re: /复核|通过|驳回/, perm: 'audit' }],
    'merchant-exit.html':    [],
    'merchant-dunning.html': [{ re: /补发|暂停|恢复|导入|扫描|规则|登记|撤销/, perm: 'write' }],

    'contract-template.html': [{ re: /新增|编辑|复制|启停|回滚|保存|导出/, perm: 'write' }],
    'contract-list.html':     [{ re: /终止|映射|录入|导入|签署|同步|保证金/, perm: 'write' }],
    'contract-change.html':   [{ re: /审核|通过|驳回/, perm: 'audit' }],
    'contract-apply.html':    [{ re: /发起|发送|重发|改绑|撤回|审核|盖章|导入|新建|同步/, perm: 'write' }],

    'study-approve.html': [{ re: /通过|驳回|补材料/, perm: 'audit' }],
    'study-route.html':   [{ re: /上架|下架|新增|编辑|添加/, perm: 'write' }],
    'study-group.html':   [{ re: /催收|导出|精选|隐藏/, perm: 'write' }],
    'study-base.html':    [{ re: /新增|编辑|删除/, perm: 'write' }],
    'study-letter.html':  [{ re: /编辑|复制|停用|归档|催收|删除/, perm: 'audit' }],
    'study-promo.html':   [{ re: /预览|更新/, perm: 'write' }],

    'expo-list.html':            [{ re: /新建|复制|保存|新增|删除|生成存档/, perm: 'write' }],
    'expo-booth.html':           [{ re: /终审|初核|通过|驳回|收款/, perm: 'audit' }],
    'expo-visitor.html':         [{ re: /通过|驳回|导出/, perm: 'write' }],
    'expo-exhibitor.html':       [{ re: /审核|精选|提醒|收款|启用/, perm: 'write' }],
    'expo-schedule-manage.html': [{ re: /发布|保存|删除|添加|通知/, perm: 'write' }],
    'expo-checkin.html':         [{ re: /补签|补录|撤销|标记|导出/, perm: 'write' }],
    'expo-material.html':        [{ re: /上传|上架|下架|审核|删除/, perm: 'write' }],
    'expo-archive.html':         [{ re: /生成|导出|复制|编辑/, perm: 'audit' }]
  };

  var CONF = /[?&]conflict=1/.test(location.search);
  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var rules = RULES[file] || [];

  var role = 'lead';          // 默认主管：不改变原有演示行为
  var lastClickAt = 0;

  function need(text) {
    for (var i = 0; i < rules.length; i++) { if (rules[i].re.test(text)) return rules[i].perm; }
    return null;
  }
  function allowed(perm) {
    if (!perm) return true;
    return !!(ROLES[role].perms[perm]);
  }

  function tip(msg) {
    var t = document.getElementById('__og_tip');
    if (!t) {
      t = document.createElement('div');
      t.id = '__og_tip';
      t.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);background:#1F2430;color:#fff;' +
        'font-size:13px;line-height:1.5;padding:10px 20px;border-radius:10px;z-index:99999;opacity:0;' +
        'pointer-events:none;transition:opacity .18s;max-width:80vw;text-align:center';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t.__tid);
    t.__tid = setTimeout(function () { t.style.opacity = '0'; }, 2600);
  }

  // 捕获阶段拦截：命中越权按钮则阻断原有 onclick
  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.hasAttribute && (el.hasAttribute('onclick') || el.tagName === 'BUTTON' || el.classList.contains('lk') || el.classList.contains('lk-gray'))) {
        var text = (el.textContent || '').replace(/\s+/g, '');
        var perm = need(text);
        if (perm && !allowed(perm)) {
          e.preventDefault(); e.stopPropagation();
          tip('无权限，请联系管理员');
          return;
        }
        if (perm && CONF) {
          e.preventDefault(); e.stopPropagation();
          tip('该记录已被他人修改，请刷新后重试');
          return;
        }
        if (perm) {
          var now = Date.now();
          if (now - lastClickAt < 500) { e.preventDefault(); e.stopPropagation(); return; }
          lastClickAt = now;
        }
        return;
      }
      el = el.parentNode;
    }
  }, true);

  // 右上角角色切换器
  function mount() {
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;top:12px;right:14px;z-index:99998;display:flex;align-items:center;gap:6px;' +
      'background:#fff;border:1px solid #E2E8F0;border-radius:999px;padding:4px 6px 4px 12px;' +
      'box-shadow:0 4px 16px rgba(15,23,42,.08);font-size:12px;color:#64748B';
    box.innerHTML = '<span style="opacity:.75">当前角色</span>';
    var sel = document.createElement('select');
    sel.style.cssText = 'border:none;outline:none;background:transparent;font-size:12px;color:#1F2430;font-weight:600;cursor:pointer';
    Object.keys(ROLES).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = ROLES[k].name;
      sel.appendChild(o);
    });
    sel.value = role;
    sel.onchange = function () { role = sel.value; tip('已切换为：' + ROLES[role].name); };
    box.appendChild(sel);
    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
