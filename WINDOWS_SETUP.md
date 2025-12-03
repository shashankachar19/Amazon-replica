# Windows Setup Guide

## Quick Start on Windows

### 1. Prerequisites
- Install **Node.js** from https://nodejs.org (v14 or higher)
- No MongoDB needed - uses SQLite database

### 2. Extract and Setup
```cmd
cd path\to\amazon-replica
```

### 3. Install Dependencies

**Backend:**
```cmd
cd backend
npm install
cd ..
```

**Frontend:**
```cmd
cd client
npm install
cd ..
```

### 4. Import Sample Data
```cmd
cd backend
npm run data:import
cd ..
```

### 5. Start Application

**Option A - Automatic (Both servers):**
```cmd
start-app.bat
```

**Option B - Manual (Separate terminals):**

Terminal 1 (Backend):
```cmd
cd backend
npm run dev
```

Terminal 2 (Frontend):
```cmd
cd client
npm run dev
```

### 6. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Troubleshooting

### Port Already in Use
If ports 5000 or 5173 are busy:
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Issues
Delete and recreate:
```cmd
cd backend
del database.sqlite
npm run data:import
```

## Notes
- SQLite database file: `backend/database.sqlite`
- No external database service required
- All data stored locally
