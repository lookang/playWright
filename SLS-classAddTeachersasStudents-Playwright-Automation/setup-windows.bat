@echo off
echo.
echo ========================================
echo  SLS Playwright Automation - Windows Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version

echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Installing Playwright browsers...
call npx playwright install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Playwright browsers
    pause
    exit /b 1
)

echo.
echo Creating directories...
if not exist "logs" mkdir logs
if not exist "screenshots" mkdir screenshots

echo.
echo Checking for data.csv...
if not exist "data.csv" (
    echo [WARNING] data.csv file not found!
    echo.
    echo You need to create your data.csv file:
    echo 1. Copy sample: copy data-sample.csv data.csv
    echo 2. Edit data.csv with your teacher emails
    echo 3. Format: SerialNo,Email with @moe.edu.sg addresses
    echo.
    echo For detailed help, read: DATA-SETUP.md
    echo.
)

echo.
echo ========================================
echo  Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Create your data.csv file (if not done already)
echo 2. Run the automation: npm start
echo 3. Read README.md for detailed instructions
echo.
echo Happy automating!
pause
