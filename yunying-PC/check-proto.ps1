<#
.SYNOPSIS 原型交互自检：扫码所有后台原型页面，找出"点了没反应"的按钮。
.DESCRIPTION
  1) 任何 <button> 缺少 onclick 绑定 -> 警告
  2) 任何 class 含 "lk"（可点击文本链）缺少 onclick -> 警告
  3) onclick="X(...)" 调用的函数在本页 <script> 中未定义且不在内置白名单 -> 错误
  4) 页面未以 </html> 正常闭合 -> 错误
#>
param([string]$Dir = '.', [string[]]$Names = @())

$Builtins = @('toast','openD','closeD','alert','confirm','console','toggle','_tab','tabSwitch')
$problems = @()
$total = 0

if ($Names.Count -eq 1 -and $Names[0] -match ',') { $Names = $Names[0] -split ',' }
$files = Get-ChildItem -Path $Dir -Filter '*.html' -File | Where-Object { $_.Name -notin @('developing.html','index-PC-yunying.html') }
if ($Names.Count -gt 0) { $files = $files | Where-Object { $_.Name -in $Names } }

foreach ($f in $files) {
    $html = [IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $total++
    $fileTag = $f.Name

    # 4) 闭合
    if ($html -notmatch '</html>\s*$') { $problems += "[$fileTag] ERROR 未以 </html> 闭合" }

    # 收集本页定义的 JS 函数
    $defined = @{}
    [regex]::Matches($html, 'function\s+([A-Za-z_$][\w$]*)') | ForEach-Object { $defined[$_.Groups[1].Value] = $true }
    [regex]::Matches($html, '(var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*function') | ForEach-Object { $defined[$_.Groups[2].Value] = $true }

    # 提取所有标签上的 onclick 调用名
    $calledFns = @{}
    [regex]::Matches($html, 'onclick="([^"]*)"') | ForEach-Object {
        $body = $_.Groups[1].Value
        [regex]::Matches($body, '([A-Za-z_$][\w$]*)\s*\(') | ForEach-Object { $calledFns[$_.Groups[1].Value] = $true }
    }

    # 3) 检查被调用函数是否定义
    foreach ($fn in $calledFns.Keys) {
        if (-not $defined.ContainsKey($fn) -and $fn -notin $Builtins) {
            $problems += "[$fileTag] ERROR onclick 调用未定义函数: $fn()"
        }
    }

    # 1) <button> 无 onclick
    [regex]::Matches($html, '<button\b[^>]*>') | ForEach-Object {
        $tag = $_.Value
        if ($tag -notmatch 'onclick=') {
            # 允许 type=submit 或含 disabled 的占位
            if ($tag -notmatch 'type="submit"' -and $tag -notmatch 'disabled') {
                $problems += "[$fileTag] WARN <button> 无 onclick 绑定: $($tag.Substring(0,[Math]::Min(60,$tag.Length)))"
            }
        }
    }

    # 2) class 含 lk 的 span 无 onclick
    [regex]::Matches($html, '<span\b[^>]*class="[^"]*\blk\b[^"]*"[^>]*>') | ForEach-Object {
        $tag = $_.Value
        if ($tag -notmatch 'onclick=') {
            $problems += "[$fileTag] WARN 可点击文本链(.lk) 无 onclick: $($tag.Substring(0,[Math]::Min(60,$tag.Length)))"
        }
    }
}

$out = "========================================`r`n"
$out += "原型交互自检（共扫描 $total 个页面）`r`n"
$out += "========================================`r`n"
if ($problems.Count -eq 0) {
    $out += "[OK] 未发现交互问题：所有按钮均已绑定、无未定义函数调用、HTML 正常闭合`r`n"
} else {
    $err = ($problems | Where-Object { $_ -match 'ERROR' }).Count
    $warn = ($problems | Where-Object { $_ -match 'WARN' }).Count
    $out += "发现 $($problems.Count) 项（ERROR=$err / WARN=$warn）：`r`n"
    $problems | ForEach-Object { $out += "  $_`r`n" }
}
# 同时输出到控制台与 UTF-8 日志，避免控制台编码乱码
Write-Output $out
[IO.File]::WriteAllText((Join-Path $Dir '_pc.txt'), $out, [System.Text.Encoding]::UTF8)
