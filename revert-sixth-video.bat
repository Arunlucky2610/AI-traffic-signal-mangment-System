@echo off
echo Reverting sixth video integration...

REM Update EmergencyDetection.jsx to remove Hyderabad traffic video
powershell -Command "(Get-Content 'src\components\EmergencyDetection.jsx') -replace '{ id: 6, name: ''Hyderabad Heavy Traffic'', status: ''active'', confidence: 97.1, lastDetection: ''Live'', video: ''/videos/hyderabad-traffic-feed.mp4'' }', '{ id: 6, name: ''Hospital District'', status: ''active'', confidence: 98.9, lastDetection: ''30 sec ago'', video: videoFiles[5] }' | Set-Content 'src\components\EmergencyDetection.jsx'"

REM Optional: Remove Hyderabad traffic video file (uncomment if needed)
REM del "public\videos\hyderabad-traffic-feed.mp4"

echo Sixth video integration reverted successfully!
echo Original EmergencyDetection.jsx restored.
pause