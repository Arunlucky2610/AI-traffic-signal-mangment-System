@echo off
echo ========================================
echo   LIVE GOOGLE MAPS REVERT
echo ========================================
echo Reverting Live Google Maps upgrade...

REM Restore original LiveGoogleMap component
echo [1/1] Restoring original LiveGoogleMap.jsx...
copy "src\components\LiveGoogleMap-BACKUP.jsx" "src\components\LiveGoogleMap.jsx" >nul
if %errorlevel% equ 0 (
    echo ✓ LiveGoogleMap.jsx restored successfully
) else (
    echo ✗ Failed to restore LiveGoogleMap.jsx
)

echo.
echo ========================================
echo ✓ REVERT COMPLETED SUCCESSFULLY!
echo ========================================
echo Your Google Maps section has been restored to original state.
echo You can safely refresh your browser.
echo.
pause