@echo off
echo ========================================
echo  Running BizFlow Tests (One by One)
echo ========================================
echo.

echo [1/10] Simple test...
npx vitest --run src/tests/simple.test.jsx
echo.

echo [2/10] Button test...
npx vitest --run src/components/tests/Button.test.jsx
echo.

echo [3/10] Navbar test...
npx vitest --run src/components/tests/Navbar.test.jsx
echo.

echo [4/10] Dashboard test...
npx vitest --run src/modules/dashboard/__tests__/Dashboard.test.jsx
echo.

echo [5/10] Dashboard2 test...
npx vitest --run src/modules/dashboard/__tests__/Dashboard2.test.jsx
echo.

echo [6/10] Auth service test...
npx vitest --run src/services/__tests__/authService.test.js
echo.

echo [7/10] Executive service test...
npx vitest --run src/services/__tests__/executiveDashboardService.test.js
echo.

echo [8/10] CRM insights test...
npx vitest --run src/services/__tests__/ai/crmInsights.test.js
echo.

echo [9/10] Sales insights test...
npx vitest --run src/services/__tests__/ai/salesInsights.test.js
echo.

echo [10/10] Helpers test...
npx vitest --run src/utils/__tests__/helpers.test.js
echo.

echo ========================================
echo  All tests completed!
echo ========================================
pause