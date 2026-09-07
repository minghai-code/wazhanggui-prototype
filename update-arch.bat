@echo off
REM ============================================================
REM  一键同步「系统功能架构」MD -> 网页
REM  双击本文件即可：读取 ../ziliao 下的完整版MD,
REM  转成 arch-data.js, 刷新 index.html 即生效。
REM  也可把MD文件直接拖到本bat上以指定其他源文件。
REM ============================================================
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0update-arch.ps1" %*
pause
