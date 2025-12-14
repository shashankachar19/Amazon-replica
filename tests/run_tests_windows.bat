@echo off
echo Amazon Replica - Complete Test Suite (Windows)
echo ================================================

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run all tests
echo Running all software testing techniques...
echo.

python run_all_tests.py

echo.
echo Test execution completed!
pause