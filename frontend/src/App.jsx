import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Artists from './components/Artists';
import Albums from './components/Albums';
import Concerts from './components/Concerts';
import Contracts from './components/Contracts';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard apiUrl={API_BASE_URL} />} />
          <Route path="/artists" element={<Artists apiUrl={API_BASE_URL} />} />
          <Route path="/albums" element={<Albums apiUrl={API_BASE_URL} />} />
          <Route path="/concerts" element={<Concerts apiUrl={API_BASE_URL} />} />
          <Route path="/contracts" element={<Contracts apiUrl={API_BASE_URL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
