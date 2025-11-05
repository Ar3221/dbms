@echo off
echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: npm not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open a new terminal and run: cd backend ^&^& npm start
echo 2. Open another terminal and run: cd frontend ^&^& npm run dev
echo.
pause

