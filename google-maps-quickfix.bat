@echo off
echo 🔧 Google Maps Quick Fix Tool
echo ===========================
echo.
echo This tool will help fix common Google Maps API issues
echo.

:menu
echo 📋 Choose a fix option:
echo 1. Check API key configuration
echo 2. Test API key with direct request  
echo 3. Open Google Cloud Console (API restrictions)
echo 4. Open debug console in browser
echo 5. Common troubleshooting steps
echo 6. Revert API key configuration
echo 0. Exit
echo.
set /p choice="Enter your choice (0-6): "

if "%choice%"=="1" goto check_api_key
if "%choice%"=="2" goto test_api_key
if "%choice%"=="3" goto open_console
if "%choice%"=="4" goto open_debug
if "%choice%"=="5" goto troubleshooting
if "%choice%"=="6" goto revert
if "%choice%"=="0" goto exit
goto menu

:check_api_key
echo.
echo 🔑 Checking API key configuration...
if exist ".env" (
    findstr "VITE_GOOGLE_MAPS_API_KEY" .env
    echo.
    echo ✅ .env file exists and contains API key setting
) else (
    echo ❌ .env file not found!
)
echo.
pause
goto menu

:test_api_key
echo.
echo 🧪 Testing API key...
echo Opening test page in your default browser...
start http://localhost:5173/debug-console.html
echo.
echo 💡 In the test page:
echo 1. Click "Run Full Debug"  
echo 2. Click "Test Simple Map"
echo 3. Check the console output for errors
echo.
pause
goto menu

:open_console
echo.
echo 🌐 Opening Google Cloud Console...
echo Check the following in your Google Cloud Console:
echo.
echo 1. API Key restrictions (Application restrictions)
echo 2. API restrictions (should include Maps JavaScript API)
echo 3. Billing account is linked and active
echo 4. Usage quotas and limits
echo.
start https://console.cloud.google.com/apis/credentials
pause
goto menu

:open_debug
echo.
echo 🔧 Opening debug console...
start http://localhost:5173/debug-console.html
echo.
echo Use the debug console to:
echo - Test API connectivity
echo - Check for authentication errors
echo - Verify map loading process
echo.
pause
goto menu

:troubleshooting
echo.
echo 🔍 Common Google Maps API Issues and Fixes:
echo.
echo ❌ Issue: Map loads then goes blank
echo ✅ Fixes:
echo    1. API key not properly configured
echo    2. Domain restrictions in Google Cloud Console
echo    3. API not enabled (Maps JavaScript API)
echo    4. Billing not enabled
echo    5. Quota exceeded
echo.
echo ❌ Issue: "This page can't load Google Maps correctly"  
echo ✅ Fixes:
echo    1. Invalid API key
echo    2. API key restrictions too strict
echo    3. Referrer restrictions blocking localhost
echo.
echo ❌ Issue: Authentication failed (gm_authFailure)
echo ✅ Fixes:
echo    1. Add localhost to authorized domains
echo    2. Add http://localhost:* to referrer restrictions
echo    3. Remove IP address restrictions
echo    4. Enable billing in Google Cloud
echo.
echo 💡 Quick Steps:
echo 1. Go to Google Cloud Console > APIs & Services > Credentials
echo 2. Click on your API key
echo 3. Under "Application restrictions" choose "HTTP referrers"
echo 4. Add: http://localhost:*, https://localhost:*
echo 5. Under "API restrictions" ensure "Maps JavaScript API" is selected
echo 6. Save and test again
echo.
pause
goto menu

:revert
echo.
echo 🔄 Reverting API key configuration...
if exist ".env.backup-2025-10-06" (
    copy ".env.backup-2025-10-06" ".env" >nul
    echo ✅ Reverted to backup configuration
    echo 🔄 Please restart your development server
) else (
    echo ❌ Backup file not found
    echo 💡 Manually edit .env file to remove API key
)
echo.
pause
goto menu

:exit
echo.
echo 👋 Google Maps Quick Fix Tool closed
echo.
echo 🔗 Useful links:
echo - Google Cloud Console: https://console.cloud.google.com/
echo - Maps API Documentation: https://developers.google.com/maps/documentation/javascript
echo - Debug Console: http://localhost:5173/debug-console.html
echo.
pause
exit
