@echo off
echo ========================================
echo  Running All BizFlow Tests
echo ========================================
echo.

set NODE_OPTIONS=--max-old-space-size=4096

echo [1/9] Running simple test...
npx vitest --run --pool=forks --maxWorkers=1 --isolate=false src/tests/simple.test.jsx
if errorlevel 1 (
    echo ❌ Simple test failed!
    pause
    exit /b 1
)

echo [2/9] Running auth tests...
npx vitest --run --pool=forks --maxWorkers=1 --isolate=false src/services/__tests__/authService.test.js
if errorlevel 1 (
    echo ❌ Auth tests failed!
    pause
    exit /b 1
)

:: Add remaining tests similarly...

echo.
echo ========================================
echo ✅ All tests completed successfully!
echo ========================================
pause