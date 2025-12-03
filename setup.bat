@echo off
echo ========================================
echo Amazon Replica - Windows Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Backend Setup
echo ========================================
echo Setting up Backend...
echo ========================================
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)
echo.

REM Frontend Setup
echo ========================================
echo Setting up Frontend...
echo ========================================
if not exist "client\node_modules" (
    echo Installing frontend dependencies...
    cd client
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
echo.

REM Database Setup
echo ========================================
echo Setting up Database...
echo ========================================
if not exist "backend\database.sqlite" (
    echo Importing sample data...
    cd backend
    call npm run data:import
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Failed to import sample data
    ) else (
        echo [OK] Sample data imported
    )
    cd ..
) else (
    echo [OK] Database already exists
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   1. Run: start-app.bat
echo   OR
echo   2. Manual start:
echo      - Backend: cd backend ^&^& npm run dev
echo      - Frontend: cd client ^&^& npm run dev
echo.
echo Access at: http://localhost:5173
echo.
pause
