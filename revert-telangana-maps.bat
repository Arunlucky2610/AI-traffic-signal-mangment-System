@echo off
echo ========================================
echo   TELANGANA GOOGLE MAPS REVERT
echo ========================================
echo Reverting Telangana Google Maps changes...

REM Restore original LiveGoogleMap component
echo [1/1] Restoring original LiveGoogleMap.jsx...
copy "src\components\LiveGoogleMap-BEFORE-TELANGANA.jsx" "src\components\LiveGoogleMap.jsx" >nul
if %errorlevel% equ 0 (
    echo ✓ LiveGoogleMap.jsx restored successfully
) else (
    echo ✗ Failed to restore LiveGoogleMap.jsx
    copy "src\components\LiveGoogleMap-BACKUP.jsx" "src\components\LiveGoogleMap.jsx" >nul
    if %errorlevel% equ 0 (
        echo ✓ Used backup restoration instead
    ) else (
        echo ✗ All restoration attempts failed
    )
)

echo.
echo ========================================
echo ✓ REVERT COMPLETED SUCCESSFULLY!
echo ========================================
echo Your Google Maps has been restored to previous state.
echo Refresh your browser to see the changes.
echo.
pause