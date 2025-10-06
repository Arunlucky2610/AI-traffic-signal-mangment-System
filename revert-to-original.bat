@echo off
echo Reverting to Original Traffic Map...
echo.

cd "C:\Users\bapat\OneDrive\Desktop\traffic emergency\AI-traffic-signal-mangment-System\src"

if exist "App-BACKUP-WORKING.jsx" (
    echo Restoring original App.jsx...
    copy "App-BACKUP-WORKING.jsx" "App.jsx" >nul
    echo ✓ App.jsx restored
) else (
    echo ❌ Backup file not found!
    pause
    exit
)

if exist "IndianLiveTrafficMap.jsx" (
    echo Removing Indian Live Traffic Map component...
    del "components\IndianLiveTrafficMap.jsx" >nul 2>&1
    echo ✓ Indian Live Traffic Map component removed
)

echo.
echo ✅ Successfully reverted to original traffic map!
echo.
echo The application will automatically reload.
echo You can now access the original traffic map functionality.
echo.
pause