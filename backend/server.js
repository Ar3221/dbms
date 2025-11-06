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

// PUT /api/artists/:id - Update artist
app.put('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, stage_name, genre, debut_year } = req.body;
    
    if (!first_name || !stage_name) {
      return res.status(400).json({ error: 'First name and stage name are required' });
    }

    const [result] = await db.query(
      'UPDATE Artists SET first_name = ?, last_name = ?, stage_name = ?, genre = ?, debut_year = ? WHERE artist_id = ?',
      [first_name, last_name || null, stage_name, genre || null, debut_year || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Artist updated: ${stage_name}`);
    res.json({ message: 'Artist updated successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error updating artist:', error.message);
    res.status(500).json({ error: 'Failed to update artist' });
  }
});

// DELETE /api/artists/:id - Delete artist
app.delete('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM Artists WHERE artist_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Artist deleted: ID ${id}`);
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error deleting artist:', error.message);
    res.status(500).json({ error: 'Failed to delete artist' });
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

// PUT /api/albums/:id - Update album
app.put('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, release_date, total_tracks, artist_id } = req.body;
    
    if (!title || !artist_id) {
      return res.status(400).json({ error: 'Album title and artist_id are required' });
    }

    const [result] = await db.query(
      'UPDATE Albums SET title = ?, release_date = ?, total_tracks = ?, artist_id = ? WHERE album_id = ?',
      [title, release_date || null, total_tracks || null, artist_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Album updated: ${title}`);
    res.json({ message: 'Album updated successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error updating album:', error.message);
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// DELETE /api/albums/:id - Delete album
app.delete('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM Albums WHERE album_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Album deleted: ID ${id}`);
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error deleting album:', error.message);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// GET /api/concerts - List all concerts with artist name
app.get('/api/concerts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.concert_id,
        c.concert_name,
        c.location,
        c.concert_date,
        c.ticket_price,
        ar.stage_name as artist_name,
        ar.artist_id
      FROM Concerts c
      LEFT JOIN Artists ar ON c.artist_id = ar.artist_id
      ORDER BY c.concert_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error fetching concerts:', error.message);
    res.status(500).json({ error: 'Failed to fetch concerts' });
  }
});

// POST /api/concerts - Add new concert
app.post('/api/concerts', async (req, res) => {
  try {
    const { concert_name, location, concert_date, ticket_price, artist_id } = req.body;
    
    if (!concert_name || !artist_id) {
      return res.status(400).json({ error: 'Concert name and artist_id are required' });
    }

    const [result] = await db.query(
      'INSERT INTO Concerts (concert_name, location, concert_date, ticket_price, artist_id) VALUES (?, ?, ?, ?, ?)',
      [concert_name, location || null, concert_date || null, ticket_price || null, artist_id]
    );

    console.log('\x1b[32m%s\x1b[0m', `✅ Concert added: ${concert_name}`);
    res.status(201).json({ 
      message: 'Concert added successfully',
      concert_id: result.insertId 
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error adding concert:', error.message);
    res.status(500).json({ error: 'Failed to add concert' });
  }
});

// PUT /api/concerts/:id - Update concert
app.put('/api/concerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { concert_name, location, concert_date, ticket_price, artist_id } = req.body;
    
    if (!concert_name || !artist_id) {
      return res.status(400).json({ error: 'Concert name and artist_id are required' });
    }

    const [result] = await db.query(
      'UPDATE Concerts SET concert_name = ?, location = ?, concert_date = ?, ticket_price = ?, artist_id = ? WHERE concert_id = ?',
      [concert_name, location || null, concert_date || null, ticket_price || null, artist_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Concert not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Concert updated: ${concert_name}`);
    res.json({ message: 'Concert updated successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error updating concert:', error.message);
    res.status(500).json({ error: 'Failed to update concert' });
  }
});

// DELETE /api/concerts/:id - Delete concert
app.delete('/api/concerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM Concerts WHERE concert_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Concert not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Concert deleted: ID ${id}`);
    res.json({ message: 'Concert deleted successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error deleting concert:', error.message);
    res.status(500).json({ error: 'Failed to delete concert' });
  }
});

// GET /api/contracts - List all contracts with artist name
app.get('/api/contracts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        co.contract_id,
        co.contract_type,
        co.management_fee,
        co.start_date,
        co.end_date,
        ar.stage_name as artist_name,
        ar.artist_id
      FROM Contracts co
      LEFT JOIN Artists ar ON co.artist_id = ar.artist_id
      ORDER BY co.end_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error fetching contracts:', error.message);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// POST /api/contracts - Add new contract
app.post('/api/contracts', async (req, res) => {
  try {
    const { contract_type, management_fee, start_date, end_date, artist_id } = req.body;
    
    if (!contract_type || !artist_id) {
      return res.status(400).json({ error: 'Contract type and artist_id are required' });
    }

    const [result] = await db.query(
      'INSERT INTO Contracts (contract_type, management_fee, start_date, end_date, artist_id) VALUES (?, ?, ?, ?, ?)',
      [contract_type, management_fee || null, start_date || null, end_date || null, artist_id]
    );

    console.log('\x1b[32m%s\x1b[0m', `✅ Contract added: ${contract_type}`);
    res.status(201).json({ 
      message: 'Contract added successfully',
      contract_id: result.insertId 
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error adding contract:', error.message);
    res.status(500).json({ error: 'Failed to add contract' });
  }
});

// PUT /api/contracts/:id - Update contract
app.put('/api/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { contract_type, management_fee, start_date, end_date, artist_id } = req.body;
    
    if (!contract_type || !artist_id) {
      return res.status(400).json({ error: 'Contract type and artist_id are required' });
    }

    const [result] = await db.query(
      'UPDATE Contracts SET contract_type = ?, management_fee = ?, start_date = ?, end_date = ?, artist_id = ? WHERE contract_id = ?',
      [contract_type, management_fee || null, start_date || null, end_date || null, artist_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Contract updated: ${contract_type}`);
    res.json({ message: 'Contract updated successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error updating contract:', error.message);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

// DELETE /api/contracts/:id - Delete contract
app.delete('/api/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM Contracts WHERE contract_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Contract deleted: ID ${id}`);
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error deleting contract:', error.message);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

// GET /api/dashboard/stats - Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [artistCount] = await db.query('SELECT COUNT(*) as count FROM Artists');
    const [albumCount] = await db.query('SELECT COUNT(*) as count FROM Albums');
    const [concertCount] = await db.query('SELECT COUNT(*) as count FROM Concerts');
    const [revenue] = await db.query(`
      SELECT SUM(c.ticket_price * 50000) as total_revenue 
      FROM Concerts c
    `);
    const [genreData] = await db.query(`
      SELECT genre, COUNT(*) as count 
      FROM Artists 
      WHERE genre IS NOT NULL 
      GROUP BY genre
    `);
    const [topArtists] = await db.query(`
      SELECT 
        ar.stage_name,
        COUNT(c.concert_id) as concert_count,
        SUM(c.ticket_price * 50000) as revenue
      FROM Artists ar
      LEFT JOIN Concerts c ON ar.artist_id = c.artist_id
      GROUP BY ar.artist_id, ar.stage_name
      ORDER BY revenue DESC
      LIMIT 5
    `);
    const [activityLog] = await db.query(`
      SELECT log_message, log_time 
      FROM Concert_Log 
      ORDER BY log_time DESC 
      LIMIT 5
    `);

    res.json({
      totalArtists: artistCount[0].count,
      totalAlbums: albumCount[0].count,
      totalConcerts: concertCount[0].count,
      estimatedRevenue: revenue[0].total_revenue || 0,
      genres: genreData,
      topArtists: topArtists,
      activityFeed: activityLog
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error fetching dashboard stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Server running on http://localhost:${PORT}`);
});

