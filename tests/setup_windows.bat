@echo off
echo Setting up Python virtual environment for Windows...

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

echo Setup complete! Run: run_tests_windows.bat
pause