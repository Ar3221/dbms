import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Hardcoded database configuration (update these values with your MySQL credentials)
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'artist_management_mvp',
};

async function testConnection() {
  try {
    console.log('\n🔍 Testing MySQL Connection...\n');
    console.log('Configuration:');
    console.log(`  Host: ${DB_CONFIG.host}`);
    console.log(`  User: ${DB_CONFIG.user}`);
    console.log(`  Database: ${DB_CONFIG.database}`);
    console.log(`  Password: ${DB_CONFIG.password ? '***' : 'NOT SET'}\n`);

    const connection = await mysql.createConnection(DB_CONFIG);

    console.log('\x1b[32m%s\x1b[0m', '✅ Successfully connected to MySQL!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Artists');
    console.log(`📊 Found ${rows[0].count} artists in database\n`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Connection failed:');
    console.error(`   Error: ${error.message}\n`);
    console.log('💡 Troubleshooting:');
    console.log('   1. Check if MySQL server is running');
    console.log('   2. Update DB_CONFIG values in this file or .env file');
    console.log('   3. Ensure database "artist_management_mvp" exists');
    console.log('   4. Check MySQL user permissions\n');
    process.exit(1);
  }
}

testConnection();
