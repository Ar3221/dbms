import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\x1b[36m%s\x1b[0m', '\n🎵 Artist Management System - Setup\n');
  console.log('Please provide your MySQL database credentials:\n');

  const projectName = await question('Project name (default: artist-mvp): ') || 'artist-mvp';
  const dbHost = await question('MySQL Host (default: localhost): ') || 'localhost';
  const dbUser = await question('MySQL Username (default: root): ') || 'root';
  const dbPassword = await question('MySQL Password: ');
  const dbName = await question('Database Name (default: artist_management_mvp): ') || 'artist_management_mvp';
  const port = await question('Backend Port (default: 4000): ') || '4000';

  const envContent = `DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}
PORT=${port}
`;

  // Write .env file
  const fs = await import('fs');
  fs.writeFileSync('backend/.env', envContent);

  console.log('\n\x1b[32m%s\x1b[0m', '✅ Configuration saved to backend/.env\n');
  console.log('\x1b[33m%s\x1b[0m', '📋 Next Steps:\n');
  console.log('1. Install backend dependencies:');
  console.log('   cd backend && npm install\n');
  console.log('2. Install frontend dependencies:');
  console.log('   cd frontend && npm install\n');
  console.log('3. Start the backend server:');
  console.log('   cd backend && npm start\n');
  console.log('4. Start the frontend dev server (in a new terminal):');
  console.log('   cd frontend && npm run dev\n');

  rl.close();
}

setup().catch(console.error);

