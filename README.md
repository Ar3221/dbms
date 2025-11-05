# Artist Management System MVP

A full-stack Artist Management System built with Node.js, Express, MySQL, and React (Vite).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- MySQL database already created with tables: Artists, Albums, Songs, Contracts, Concerts

### Setup

1. **Configure Database Connection**
   ```bash
   node setup.js
   ```
   Or manually create `backend/.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=artist_management_mvp
   PORT=4000
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:4000`

5. **Start Frontend Dev Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
artist-mvp/
├── backend/
│   ├── server.js       # Express server with API routes
│   ├── db.js           # MySQL connection pool
│   ├── .env            # Environment variables (create from .env.example)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   └── components/
    │       ├── Artists.jsx
    │       └── Albums.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🎯 API Endpoints

- `GET /api/artists` - List all artists
- `POST /api/artists` - Add new artist
- `GET /api/albums` - List all albums with artist names
- `POST /api/albums` - Add new album

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + MySQL (mysql2)
- **Frontend**: React + Vite
- **Database**: MySQL (direct connection, no ORM)

## 📝 Notes

- The backend uses colorized console output for success/error messages
- Frontend components use inline styles (no CSS frameworks)
- API calls are logged to browser console
- CORS is enabled for development
- Database schema includes: Artists (first_name, last_name, stage_name, genre, debut_year), Albums (title, release_date, total_tracks, artist_id), Songs, Contracts, and Concerts tables
- Artists table uses `stage_name` as the unique identifier for display

