@echo off
echo Reverting fifth video integration...

REM Update EmergencyDetection.jsx to remove Road traffic sound video
powershell -Command "(Get-Content 'src\components\EmergencyDetection.jsx') -replace '{ id: 5, name: ''Tambaram Road Traffic'', status: ''active'', confidence: 95.3, lastDetection: ''Live'', video: ''/videos/road-traffic-sound-feed.mp4'' }', '{ id: 5, name: ''Central Plaza'', status: ''active'', confidence: 96.5, lastDetection: ''3 min ago'', video: videoFiles[4] }' | Set-Content 'src\components\EmergencyDetection.jsx'"

REM Optional: Remove Road traffic sound video file (uncomment if needed)
REM del "public\videos\road-traffic-sound-feed.mp4"

echo Fifth video integration reverted successfully!
echo Original EmergencyDetection.jsx restored.
pause