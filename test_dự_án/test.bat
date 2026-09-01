@echo off
chcp 65001 >nul
if not exist "%~dp0system" (
    echo LOI KHONG TIM THAY
    echo %~dp0
) else (
    echo TIM THAY SYSTEM OK
    echo %~dp0
)
