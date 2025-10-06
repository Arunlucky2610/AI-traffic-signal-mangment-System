@echo off
echo 🗺️  Google Maps Integration Setup
echo =================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo 📋 Creating .env file from template...
    copy .env.example .env >nul 2>&1 || echo ⚠️  Please create .env file manually
)

REM Check current API key status
findstr /C:"your_google_maps_api_key_here" .env >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🔑 API Key Status: ❌ Not configured
    echo.
    echo 📋 To fix the blank map issue, you need to:
    echo    1. Get a Google Maps API key from: https://console.cloud.google.com/
    echo    2. Enable these APIs:
    echo       • Maps JavaScript API
    echo       • Places API
    echo       • Directions API
    echo       • Distance Matrix API
    echo    3. Update your .env file with the API key
    echo    4. Restart your development server
    echo.
    echo 💡 Your API key should look like: AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
    echo.
    
    REM Prompt for API key
    set /p api_key="🔑 Enter your Google Maps API key (or press Enter to skip): "
    
    if not "!api_key!"=="" (
        REM Update .env file with the API key
        powershell -Command "(Get-Content .env) -replace 'your_google_maps_api_key_here', '%api_key%' | Set-Content .env"
        echo ✅ API key updated in .env file!
        echo 🔄 Please restart your development server now
    ) else (
        echo ⏭️  Skipping API key setup
        echo 📝 You can manually edit the .env file later
    )
) else (
    echo 🔑 API Key Status: ✅ Configured
    echo 🎉 Your Google Maps integration should be working!
)

echo.
echo 🛠️  Additional Setup Commands:
echo    npm run dev                    # Start React development server
echo    python google_maps_service.py  # Start backend API service
echo.
echo 🌐 Open your app at: http://localhost:5173
echo 📍 Navigate to: Google Maps section
echo.
echo ❓ Having issues? Check the GOOGLE_MAPS_API_SETUP.md file for detailed troubleshooting
echo.
pause