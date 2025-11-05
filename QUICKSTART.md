# Quick Start Guide

## Prerequisites
Make sure Node.js (v18+) is installed:
- Download from: https://nodejs.org/
- After installation, restart your terminal/PowerShell

## Running the Application

### Step 1: Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

### Step 2: Verify .env File
Make sure `backend/.env` exists with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=artist_management_mvp
PORT=4000
```

### Step 3: Start Backend Server
Open Terminal 1:
```powershell
cd backend
npm start
```
Backend will run on http://localhost:4000

### Step 4: Start Frontend Server
Open Terminal 2 (new terminal):
```powershell
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Troubleshooting

- If `npm` command not found: Restart terminal after installing Node.js
- If MySQL connection fails: Check `.env` file credentials
- If port already in use: Change PORT in `.env` file

