# Quick Start Guide

## 🚀 Ubuntu/Linux/Mac

```bash
# First time setup
./start.sh

# Start servers (2 terminals)
cd backend && npm run dev
cd client && npm run dev
```

## 🪟 Windows

```cmd
REM First time setup
setup.bat

REM Start both servers
start-app.bat
```

## 🌐 Access

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 📦 Transfer to Another OS

### Before Zipping (Optional - saves space):
```bash
# Ubuntu
rm -rf backend/node_modules client/node_modules
rm -f backend/database.sqlite
```

```cmd
REM Windows
rmdir /s /q backend\node_modules client\node_modules
del backend\database.sqlite
```

### After Extracting:
**Ubuntu:** Run `./start.sh`  
**Windows:** Run `setup.bat`

## ✅ That's It!

Your project works on both operating systems without any code changes.
