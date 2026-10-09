<#
  ============================================================
  重建各端原型页面的 Tailwind 静态样式（本地化，不依赖外网）
  ============================================================
  用法：
      powershell -NoProfile -ExecutionPolicy Bypass -File build.ps1

  它做什么：
    1) 首次运行自动 npm install（走本机已配置的 npm 镜像）
    2) 用 tailwind.config.js 扫描 yunying-PC / mai-APP / shanghu-APP / mai-PC / daping-PC
       下所有 .html 与 .js（含 menu-data.js）里用到的 Tailwind class
    3) 产出 dist/tailwind.css，并复制成各目录下的 tailwind.css（页面用相对路径引用）

  为什么要这样做：
    原来各页面引用 https://cdn.tailwindcss.com（Tailwind Play CDN，浏览器里实时编译）。
    该域名走 Cloudflare，在部分网络下不可达 —— 一旦拉不到，页面就"只剩骨架、没有样式"。
    现在改成预编译静态 CSS，断网也能正常显示（图标仍走 cdnjs）。

  什么时候必须重跑本脚本：
    - 新增/修改页面里用到的 Tailwind class（尤其是任意值类，如 text-[13px] / w-[420px] / bg-[#F1F5F9]）
    - 新增页面（新页面要在 </head> 前引用 <link rel="stylesheet" href="tailwind.css">）
    ★ 症状对照：页面"新加的 class 不生效" = 忘了重跑本脚本。

  其它说明：
    - 页面里若用 JS 动态拼接 class 名，请把拼出来的完整类名写进 tailwind.config.js 的 safelist。
    - 主题色（primary / primary-d / primary-l）在 tailwind.config.js 里与页面内原配置保持一致，
      改动请两处同步（若页面里还留有 tailwind.config 内联脚本块，一并同步）。
#>
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$base = Split-Path -Parent $here
$dirs = 'yunying-PC', 'mai-APP', 'shanghu-APP', 'mai-PC', 'daping-PC'

Set-Location $here
if (-not (Test-Path (Join-Path $here 'node_modules'))) {
  Write-Host '[1/3] 首次运行，安装依赖 …'
  npm install --no-audit --no-fund
}
else {
  Write-Host '[1/3] 依赖已就绪'
}

Write-Host '[2/3] 编译 tailwind.css …'
# 注意：直接 -o dist/tailwind.css 覆盖写，在本机出现过「输出文件未被刷新」的情况（编译日志正常、文件字节与时间戳不变，新 class 不生效）。
# 因此改为：编译到临时文件 → 强制覆盖（原子替换），保证产物一定是本次编译结果。
$tmp = Join-Path $here 'dist\tailwind.new.css'
if (Test-Path $tmp) { Remove-Item $tmp -Force }
npx tailwindcss -c tailwind.config.js -i input.css -o dist/tailwind.new.css --minify
Move-Item $tmp (Join-Path $here 'dist\tailwind.css') -Force

Write-Host '[3/3] 分发到各端目录 …'
foreach ($d in $dirs) {
  if (Test-Path (Join-Path $base $d)) {
    Copy-Item (Join-Path $here 'dist\tailwind.css') (Join-Path $base "$d\tailwind.css") -Force
  }
}
$size = (Get-Item (Join-Path $here 'dist\tailwind.css')).Length
Write-Host ("完成：dist/tailwind.css {0} bytes → {1}" -f $size, ($dirs -join ' / '))
