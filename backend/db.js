import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// DATABASE CONFIGURATION
// ============================================
// Update these values with your MySQL credentials
// Priority: .env file > hardcoded values below
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',           // Change this if needed
  user: process.env.DB_USER || 'root',                // Change this if needed
  password: process.env.DB_PASSWORD || 'root',            // Change this if needed (empty string = no password)
  database: process.env.DB_NAME || 'artist_management_mvp',  // Change this if needed
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
// ============================================

const pool = mysql.createPool(DB_CONFIG);

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log('\x1b[32m%s\x1b[0m', '✅ Connected to MySQL');
    connection.release();
  })
  .catch((err) => {
    console.error('\x1b[31m%s\x1b[0m', '❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

export default pool;

