@echo off
echo ========================================
echo    GOOGLE MAPS INTEGRATION REVERT
echo ========================================
echo Reverting all Google Maps changes...

REM Restore original App.jsx
echo [1/3] Restoring App.jsx...
copy "src\App-BACKUP.jsx" "src\App.jsx" >nul
if %errorlevel% equ 0 (
    echo ✓ App.jsx restored successfully
) else (
    echo ✗ Failed to restore App.jsx
)

REM Remove Google Maps component
echo [2/3] Removing Google Maps component...
if exist "src\components\GoogleLiveTrafficMap.jsx" (
    del "src\components\GoogleLiveTrafficMap.jsx" >nul
    echo ✓ GoogleLiveTrafficMap.jsx removed
) else (
    echo - GoogleLiveTrafficMap.jsx not found (already clean)
)

REM Remove environment files if created
echo [3/3] Cleaning environment files...
if exist ".env.local" (
    del ".env.local" >nul
    echo ✓ .env.local removed
) else (
    echo - No .env.local to remove
)
if exist "google-maps-setup.env" (
    del "google-maps-setup.env" >nul
    echo ✓ google-maps-setup.env removed
) else (
    echo - No google-maps-setup.env to remove
)

echo.
echo ========================================
echo ✓ REVERT COMPLETED SUCCESSFULLY!
echo ========================================
echo Your system has been restored to the original state.
echo You can safely restart your development server.
echo.
pause