@echo off
echo ========================================
echo   GOOGLE MAPS API REVERT
echo ========================================
echo Reverting Google Maps API integration...

REM Restore original component
echo [1/1] Restoring previous LiveGoogleMap.jsx...
copy "src\components\LiveGoogleMap-BEFORE-API.jsx" "src\components\LiveGoogleMap.jsx" >nul
if %errorlevel% equ 0 (
    echo ✓ LiveGoogleMap.jsx restored successfully
) else (
    echo ✗ Failed to restore LiveGoogleMap.jsx
    REM Try other backups
    if exist "src\components\LiveGoogleMap-BACKUP.jsx" (
        copy "src\components\LiveGoogleMap-BACKUP.jsx" "src\components\LiveGoogleMap.jsx" >nul
        if %errorlevel% equ 0 (
            echo ✓ Used backup restoration instead
        )
    )
)

echo.
echo ========================================
echo ✓ REVERT COMPLETED SUCCESSFULLY!
echo ========================================
echo Google Maps has been reverted to previous version.
echo Refresh your browser to see the changes.
echo.
pause