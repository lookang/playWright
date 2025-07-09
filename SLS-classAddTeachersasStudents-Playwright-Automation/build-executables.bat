@echo off
echo.
echo ========================================
echo  Building SLS Automation Executables
echo ========================================
echo.

REM Check if pkg is installed globally
pkg --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing pkg globally...
    call npm install -g pkg
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install pkg
        pause
        exit /b 1
    )
)

REM Create dist directory
if not exist "dist" mkdir dist

echo Building executables for all platforms...
echo.

REM Build for all platforms
call npm run build-all

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  Build completed successfully!
    echo ========================================
    echo.
    echo Generated files in dist/ folder:
    dir dist\
    echo.
    echo Distribution packages:
    echo - Windows: sls-playwright-automation-win.exe
    echo - macOS: sls-playwright-automation-macos
    echo - Linux: sls-playwright-automation-linux
    echo.
    echo To distribute:
    echo 1. Copy the appropriate executable for each platform
    echo 2. Include data-sample.csv and config.json in the same folder
    echo 3. Users just need to:
    echo    - Create their data.csv file
    echo    - Double-click the executable
    echo.
    echo Ready for distribution!
    echo.
) else (
    echo [ERROR] Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause
