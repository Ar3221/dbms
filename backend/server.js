import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET /api/artists - List all artists
app.get('/api/artists', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Artists ORDER BY artist_id DESC');
    res.json(rows);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error fetching artists:', error.message);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// POST /api/artists - Add new artist
app.post('/api/artists', async (req, res) => {
  try {
    const { first_name, last_name, stage_name, genre, debut_year } = req.body;
    
    if (!first_name || !stage_name) {
      return res.status(400).json({ error: 'First name and stage name are required' });
    }

    const [result] = await db.query(
      'INSERT INTO Artists (first_name, last_name, stage_name, genre, debut_year) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name || null, stage_name, genre || null, debut_year || null]
    );

    console.log('\x1b[32m%s\x1b[0m', `✅ Artist added: ${stage_name}`);
    res.status(201).json({ 
      message: 'Artist added successfully',
      artist_id: result.insertId 
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error adding artist:', error.message);
    res.status(500).json({ error: 'Failed to add artist' });
  }
});

// GET /api/albums - List all albums with artist name
app.get('/api/albums', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.album_id,
        a.title,
        a.release_date,
        a.total_tracks,
        ar.stage_name as artist_name,
        ar.artist_id
      FROM Albums a
      LEFT JOIN Artists ar ON a.artist_id = ar.artist_id
      ORDER BY a.album_id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error fetching albums:', error.message);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// POST /api/albums - Add new album
app.post('/api/albums', async (req, res) => {
  try {
    const { title, release_date, total_tracks, artist_id } = req.body;
    
    if (!title || !artist_id) {
      return res.status(400).json({ error: 'Album title and artist_id are required' });
    }

    const [result] = await db.query(
      'INSERT INTO Albums (title, release_date, total_tracks, artist_id) VALUES (?, ?, ?, ?)',
      [title, release_date || null, total_tracks || null, artist_id]
    );

    console.log('\x1b[32m%s\x1b[0m', `✅ Album added: ${title}`);
    res.status(201).json({ 
      message: 'Album added successfully',
      album_id: result.insertId 
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error adding album:', error.message);
    res.status(500).json({ error: 'Failed to add album' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Server running on http://localhost:${PORT}`);
});

