@echo off
echo ========================================
echo  Running Passing BizFlow Tests
echo ========================================
echo.

echo [1/4] Running simple test...
npx vitest --run --no-isolate src/tests/simple.test.jsx
echo.

echo [2/4] Running Navbar test...
npx vitest --run --no-isolate src/components/tests/Navbar.test.jsx
echo.

echo [3/4] Running authService test...
npx vitest --run --no-isolate src/services/__tests__/authService.test.js
echo.

echo [4/4] Running executiveDashboardService test...
npx vitest --run --no-isolate src/services/__tests__/executiveDashboardService.test.js
echo.

echo ========================================
echo  All passing tests completed!
echo ========================================
pause