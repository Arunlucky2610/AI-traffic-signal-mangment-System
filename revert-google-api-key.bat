@echo off
echo 🔄 Google Maps API Key Revert Script
echo ===================================
echo.
echo This script will revert your Google Maps API configuration
echo back to the previous state before API key was configured.
echo.
set /p confirm="Are you sure you want to revert? (y/N): "
if /i "%confirm%"=="y" (
    echo.
    echo 📋 Reverting .env file...
    
    if exist ".env.backup-2025-10-06" (
        copy ".env.backup-2025-10-06" ".env" >nul
        echo ✅ Successfully reverted to backup configuration
        echo 📝 Your API key has been removed from .env file
        echo 🔄 Please restart your development server: npm run dev
    ) else (
        echo ❌ Backup file not found: .env.backup-2025-10-06
        echo 💡 Manual revert: Replace API key with "your_google_maps_api_key_here" in .env
    )
    
    echo.
    echo 🗺️ After revert, maps will show setup instructions again
    echo 📋 You can re-configure by running: setup-google-maps.bat
    
) else (
    echo.
    echo ⏭️  Revert cancelled - no changes made
)

echo.
pause