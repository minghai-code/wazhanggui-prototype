<#
.SYNOPSIS
    运营管理端菜单一致性自检脚本

.DESCRIPTION
    对比 menu-data.js（唯一菜单数据源）与磁盘实际文件，检查四类问题：
      1. 断链      - 菜单 page 指向的 html 文件不存在
      2. 孤儿页面  - 目录内存在 html，但没有任何菜单引用它
      3. 重复项    - 重复菜单名、同一页面被多个菜单项引用
      4. 状态错配  - status='done' 但 page 为 null，或 status='dev' 但 page 有值
    发现问题以非零码退出。

.EXAMPLE
    .\check-menu.ps1
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'

$dir      = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataFile = Join-Path $dir 'menu-data.js'
$coreFiles = @('index-PC-yunying.html', 'developing.html', 'menu-data.js')

Write-Host ''
Write-Host '=========== 运营管理端菜单自检 ===========' -ForegroundColor Cyan

if (-not (Test-Path $dataFile)) {
    Write-Host '[FATAL] 未找到 menu-data.js' -ForegroundColor Red
    exit 1
}

$content = [System.IO.File]::ReadAllText($dataFile, [System.Text.Encoding]::UTF8)

# --- 菜单版本 ---------------------------------------------------------------
$ver = '(未声明)'
if ($content -match "MENU_VERSION\s*=\s*'([^']+)'") { $ver = $Matches[1] }
$upd = '(未声明)'
if ($content -match "MENU_UPDATED\s*=\s*'([^']+)'") { $upd = $Matches[1] }

# --- 主框架引用的版本号应与 MENU_VERSION 对应（防缓存） -----------------------
$shellFile = Join-Path $dir 'index-PC-yunying.html'
if (Test-Path $shellFile) {
    $shell = [System.IO.File]::ReadAllText($shellFile, [System.Text.Encoding]::UTF8)
    if ($shell -match 'menu-data\.js\?v=([0-9]+)') {
        $shellV  = $Matches[1]
        $expectV = ($ver -replace '[^0-9]', '')
        if ($shellV -ne $expectV) {
            Write-Host "[WARN]  主框架引用 menu-data.js?v=$shellV，与 MENU_VERSION=$ver 不一致（请同步递增）" -ForegroundColor Yellow
        }
    } else {
        Write-Host '[WARN]  主框架引用 menu-data.js 未带版本号，可能受浏览器缓存影响' -ForegroundColor Yellow
    }
}

# --- 逐行解析菜单项（约定：每个菜单项写在同一行内，且该行包含 page:） ---------
$errors = New-Object System.Collections.ArrayList
$warns  = New-Object System.Collections.ArrayList
$pageCount = @{}
$nameCount = @{}
$referenced = @{}
$itemTotal = 0
$devTotal  = 0

foreach ($line in ($content -split "`r?`n")) {
    if ($line -notmatch 'page\s*:') { continue }
    if ($line -match '^\s*//') { continue }
    $itemTotal++

    $name = ''
    if ($line -match "name\s*:\s*'([^']+)'") { $name = $Matches[1] }
    $status = ''
    if ($line -match "status\s*:\s*'([^']+)'") { $status = $Matches[1] }
    $page = $null
    if ($line -match "page\s*:\s*'([^']+)'") { $page = $Matches[1] }

    if (-not $name) {
        [void]$errors.Add("[解析失败] 该行缺少 name：$($line.Trim())")
        continue
    }
    if ($nameCount.ContainsKey($name)) { $nameCount[$name]++ } else { $nameCount[$name] = 1 }

    if ([string]::IsNullOrWhiteSpace($page)) {
        $devTotal++
        if ($status -ne 'dev') {
            [void]$errors.Add("[状态错配] '$name' page 为 null，status 却是 '$status'（应为 dev）")
        }
    } else {
        if ($status -ne 'done') {
            [void]$errors.Add("[状态错配] '$name' page='$page'，status 却是 '$status'（应为 done）")
        }
        if ($pageCount.ContainsKey($page)) { $pageCount[$page]++ } else { $pageCount[$page] = 1 }
        $referenced[$page] = $true
        if (-not (Test-Path (Join-Path $dir $page))) {
            [void]$errors.Add("[断链] '$name' 指向的页面不存在：$page")
        }
    }
}

# --- 核心文件存在性 ---------------------------------------------------------
foreach ($f in $coreFiles) {
    if (-not (Test-Path (Join-Path $dir $f))) {
        [void]$errors.Add("[缺失] 核心文件不存在：$f")
    }
}

# --- 孤儿页面 ---------------------------------------------------------------
$orphans = @()
Get-ChildItem -Path $dir -Filter '*.html' -File | ForEach-Object {
    if ($coreFiles -contains $_.Name) { return }
    if (-not $referenced.ContainsKey($_.Name)) { $orphans += $_.Name }
}
foreach ($o in $orphans) {
    [void]$errors.Add("[孤儿页面] $o 存在磁盘上，但没有任何菜单项引用它（应归档到 _legacy/ 或补进菜单）")
}

# --- 重复项 -----------------------------------------------------------------
foreach ($k in $pageCount.Keys) {
    if ($pageCount[$k] -gt 1) {
        [void]$warns.Add("[重复引用] 页面 $k 被 $($pageCount[$k]) 个菜单项引用")
    }
}
foreach ($k in $nameCount.Keys) {
    if ($nameCount[$k] -gt 1) {
        [void]$warns.Add("[重名] 菜单名 '$k' 出现 $($nameCount[$k]) 次（跨分组同名需确认是否有意）")
    }
}

# --- 输出报告 ---------------------------------------------------------------
Write-Host "菜单版本   : $ver （更新于 $upd）" -ForegroundColor Gray
Write-Host "菜单项总数 : $itemTotal"
Write-Host "已有原型   : $($itemTotal - $devTotal)"
Write-Host "开发中     : $devTotal"
Write-Host '----------------------------------------' -ForegroundColor DarkGray

if ($errors.Count -eq 0) {
    Write-Host '[OK] 未发现错误：无断链、无孤儿页面、状态全部匹配' -ForegroundColor Green
} else {
    Write-Host "[ERROR] 发现 $($errors.Count) 个问题：" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
}

if ($warns.Count -gt 0) {
    Write-Host "[WARN] $($warns.Count) 条提示：" -ForegroundColor Yellow
    $warns | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
}

Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

if ($errors.Count -gt 0) { exit 1 }
exit 0
