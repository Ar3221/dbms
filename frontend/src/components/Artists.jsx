import React, { useState, useEffect } from 'react';

const Artists = ({ apiUrl }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    stage_name: '',
    genre: '',
    debut_year: ''
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch(`${apiUrl}/artists`);
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Artist added successfully:', result);
        setFormData({ first_name: '', last_name: '', stage_name: '', genre: '', debut_year: '' });
        fetchArtists();
      } else {
        console.error('❌ Failed to add artist:', result.error);
      }
    } catch (error) {
      console.error('❌ Error adding artist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: '#4CAF50', marginTop: 0 }}>Artists</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="First Name *"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Stage Name *"
            value={formData.stage_name}
            onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Debut Year (e.g., 2020)"
            value={formData.debut_year}
            onChange={(e) => setFormData({ ...formData, debut_year: e.target.value })}
            min="1900"
            max="2100"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Adding...' : 'Add Artist'}
        </button>
      </form>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>All Artists ({artists.length})</h3>
        {artists.length === 0 ? (
          <p style={{ color: '#666' }}>No artists yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {artists.map((artist) => (
              <li
                key={artist.artist_id}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <strong>{artist.stage_name}</strong>
                {artist.genre && <span style={{ color: '#666', marginLeft: '10px' }}>({artist.genre})</span>}
                {(artist.first_name || artist.last_name) && (
                  <div style={{ fontSize: '0.85em', color: '#888' }}>
                    {artist.first_name} {artist.last_name}
                  </div>
                )}
                {artist.debut_year && (
                  <div style={{ fontSize: '0.85em', color: '#999' }}>
                    Debut: {artist.debut_year}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Artists;

