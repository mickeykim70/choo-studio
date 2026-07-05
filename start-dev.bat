@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   choo-studio 개발 서버를 시작합니다...
echo.
echo   서버가 준비되면(아래에 "localhost:4321" 표시되면)
echo   브라우저에서 이 주소를 여세요:
echo.
echo     첫 글:   http://localhost:4321/math/notes/radian
echo     칠판:    http://localhost:4321/math/board
echo     홈:      http://localhost:4321/
echo.
echo   종료하려면 이 창에서 Ctrl+C.
echo ============================================================
echo.
call npm run dev
pause
