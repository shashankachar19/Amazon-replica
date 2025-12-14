# Windows Testing Guide - Amazon Replica

## Prerequisites
- Python 3.8+ installed
- Node.js installed
- Git Bash (optional, for Unix commands)

## Quick Setup (Windows)

### 1. **Setup Environment**
```cmd
cd tests
setup_windows.bat
```

### 2. **Start Application**
**Terminal 1 - Backend:**
```cmd
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd client
npm install
npm run dev
```

### 3. **Run Tests**
**Option A - All Tests:**
```cmd
cd tests
run_tests_windows.bat
```

**Option B - Individual Tests:**
```cmd
cd tests
run_individual_windows.bat
```

**Option C - Manual Commands:**
```cmd
cd tests
venv\Scripts\activate.bat
pytest equivalence_class_test.py -v
pytest boundary_value_test.py -v
pytest decision_table_test.py -v
```

## PowerShell Alternative

### Setup:
```powershell
cd tests
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Run Tests:
```powershell
python run_all_tests.py
```

## Cross-Platform Commands

### Linux/Mac:
```bash
cd tests
source venv/bin/activate
python run_all_tests.py
```

### Windows CMD:
```cmd
cd tests
venv\Scripts\activate.bat
python run_all_tests.py
```

### Windows PowerShell:
```powershell
cd tests
venv\Scripts\Activate.ps1
python run_all_tests.py
```

## Test Coverage (Same on All Platforms)
- ✅ 11 different testing techniques
- ✅ 50+ individual test cases
- ✅ Complete software testing curriculum coverage
- ✅ Professional test reporting

## Troubleshooting Windows

### Python not found:
```cmd
python --version
# If not found, install from python.org
```

### Permission issues:
```cmd
# Run as Administrator or use:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port conflicts:
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Demo for Teacher (Windows)
1. Double-click `setup_windows.bat`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd client && npm run dev`
4. Double-click `run_tests_windows.bat`
5. Show test results and explain each technique

**Same professional results on Windows as Linux!**