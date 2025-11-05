import React, { useState, useEffect } from 'react';
import Artists from './components/Artists';
import Albums from './components/Albums';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
        🎵 Artist Management System
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div>
          <Artists apiUrl={API_BASE_URL} />
        </div>
        <div>
          <Albums apiUrl={API_BASE_URL} />
        </div>
      </div>
    </div>
  );
}

export default App;

