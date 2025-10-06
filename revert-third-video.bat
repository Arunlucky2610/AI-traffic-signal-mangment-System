@echo off
echo Reverting third video integration...

REM Update EmergencyDetection.jsx to remove Bangalore traffic video
powershell -Command "(Get-Content 'src\components\EmergencyDetection.jsx') -replace '{ id: 3, name: ''Bangalore Traffic - Koramangala'', status: ''active'', confidence: 97.8, lastDetection: ''Live'', video: ''/videos/bangalore-traffic-feed.mp4'' }', '{ id: 3, name: ''Oak St & 3rd Ave'', status: ''active'', confidence: 99.1, lastDetection: ''1 min ago'', video: videoFiles[2] }' | Set-Content 'src\components\EmergencyDetection.jsx'"

REM Optional: Remove Bangalore video file (uncomment if needed)
REM del "public\videos\bangalore-traffic-feed.mp4"

echo Third video integration reverted successfully!
echo Original EmergencyDetection.jsx restored.
pause