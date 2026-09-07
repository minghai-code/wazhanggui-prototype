# 一键同步「系统功能架构」MD -> 网页 (arch-data.js)
# 用法:
#   1) 双击 update-arch.bat  (推荐, 自动定位默认MD)
#   2) 或把 MD 文件直接拖到本脚本/ bat 上
#   3) 或命令行:  powershell -ExecutionPolicy Bypass -File update-arch.ps1 "D:\path\to\xxx.md"
#
# 原理: 读取 MD -> base64 编码 -> 写入 arch-data.js (window.__ARCH_B64__)
#       网页 index.html 启动时会解码并渲染, 因此无需任何服务器即可显示最新架构。

$base = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

# 默认架构源文件 (与脚本同级的 ../ziliao/ 下)
$defaultSrc = Join-Path $base '..\ziliao\袜掌柜智慧运营平台功能架构（完整版）.md'

$src = $args[0]
if (-not $src) { $src = $defaultSrc }

if (-not (Test-Path $src)) {
    Write-Host "ERROR: 找不到架构 MD 文件 -> $src" -ForegroundColor Red
    Write-Host "提示: 请把你的 MD 文件拖到 update-arch.bat 上, 或修改脚本里的默认路径。" -ForegroundColor Yellow
    exit 1
}

$bytes = [System.IO.File]::ReadAllBytes($src)
$b64   = [System.Convert]::ToBase64String($bytes)

$out = Join-Path $base 'arch-data.js'
$sw  = [System.IO.StreamWriter]::new($out, $false, [System.Text.Encoding]::ASCII)
$sw.Write("window.__ARCH_B64__ = `"$b64`";")
$sw.Close()

Write-Host "OK: 已更新 $out" -ForegroundColor Green
Write-Host "    源文件: $src" -ForegroundColor Gray
Write-Host "    刷新网页(index.html)即可看到最新架构。" -ForegroundColor Gray
