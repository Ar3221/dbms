import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/artists', label: 'Artists', icon: '👤' },
    { path: '/albums', label: 'Albums', icon: '🎵' },
    { path: '/concerts', label: 'Concerts', icon: '📅' },
    { path: '/contracts', label: 'Contracts', icon: '📄' },
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🎵</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>Artist Manager</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#fff' : '#2563eb',
              backgroundColor: location.pathname === item.path ? '#2563eb' : 'transparent',
              fontWeight: location.pathname === item.path ? '600' : '400',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

