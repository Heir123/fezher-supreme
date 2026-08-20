@echo off
echo ========================================
echo  Running BizFlow Test Suite
echo ========================================
echo.

echo [1/4] Running simple test...
npx vitest --run src/tests/simple.test.jsx
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

echo [2/4] Running Button test...
npx vitest --run src/components/tests/Button.test.jsx
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

echo [3/4] Running Navbar test...
npx vitest --run src/components/tests/Navbar.test.jsx
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

echo [4/4] Running authService test...
npx vitest --run src/services/__tests__/authService.test.js
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

echo ========================================
echo  All tests passed! ✓
echo ========================================