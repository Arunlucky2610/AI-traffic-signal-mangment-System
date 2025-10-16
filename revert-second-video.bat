@echo off
echo Reverting second video integration...

REM Update EmergencyDetection.jsx to remove highway traffic video
powershell -Command "(Get-Content 'src\components\EmergencyDetection.jsx') -replace '{ id: 2, name: ''Highway Traffic - Junction A'', status: ''active'', confidence: 96.2, lastDetection: ''Live'', video: ''/videos/highway-traffic-feed.mp4'' }', '{ id: 2, name: ''Main St & 2nd Ave'', status: ''active'', confidence: 94.8, lastDetection: ''5 min ago'', video: videoFiles[1] }' | Set-Content 'src\components\EmergencyDetection.jsx'"

REM Optional: Remove highway video file (uncomment if needed)
REM del "public\videos\highway-traffic-feed.mp4"

echo Second video integration reverted successfully!
echo Original EmergencyDetection.jsx restored.
pause