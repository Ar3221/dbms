import React, { useState, useEffect } from 'react';

const Dashboard = ({ apiUrl }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (revenue) => {
    if (!revenue) return '$0';
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    }
    return `$${(revenue / 1000).toFixed(0)}K`;
  };

  const getGenreColors = (index) => {
    const colors = ['#2563eb', '#7c3aed', '#ea580c', '#059669', '#dc2626'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
          Error loading dashboard data
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Please restart the backend server to load the dashboard endpoint.
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
          Run: <code style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>cd backend && npm start</code>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Overview of your artist management system</p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Artists</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalArtists}</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Albums</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalAlbums}</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Concerts</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalConcerts}</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Est. Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
            {formatRevenue(stats.estimatedRevenue)}
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Artists by Genre */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Artists by Genre</h3>
          {stats.genres && stats.genres.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.genres.map((genre, index) => {
                const total = stats.genres.reduce((sum, g) => sum + g.count, 0);
                const percentage = (genre.count / total * 100).toFixed(0);
                return (
                  <div key={index} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '500' }}>{genre.genre}</span>
                      <span style={{ color: '#6b7280' }}>{percentage}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: getGenreColors(index),
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No genre data available</p>
          )}
        </div>

        {/* Top Artists by Revenue */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Top Artists by Revenue</h3>
          {stats.topArtists && stats.topArtists.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.topArtists.map((artist, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {index + 1}. {artist.stage_name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {artist.concert_count || 0} concert{(artist.concert_count || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#16a34a' }}>
                    {formatRevenue(artist.revenue || 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No revenue data available</p>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Activity Feed</h3>
        {stats.activityFeed && stats.activityFeed.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.activityFeed.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'start',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}>
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  marginTop: '0.375rem',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#1e40af', marginBottom: '0.25rem' }}>
                    {activity.log_message}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(activity.log_time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6b7280' }}>No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

