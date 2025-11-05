import React, { useState, useEffect } from 'react';

const Albums = ({ apiUrl }) => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    release_date: '',
    total_tracks: '',
    artist_id: ''
  });

  useEffect(() => {
    fetchAlbums();
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

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`${apiUrl}/albums`);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          artist_id: parseInt(formData.artist_id)
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Album added successfully:', result);
        setFormData({ title: '', release_date: '', total_tracks: '', artist_id: '' });
        fetchAlbums();
      } else {
        console.error('❌ Failed to add album:', result.error);
      }
    } catch (error) {
      console.error('❌ Error adding album:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: '#2196F3', marginTop: 0 }}>Albums</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Album Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={formData.artist_id}
            onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Select Artist *</option>
            {artists.map((artist) => (
              <option key={artist.artist_id} value={artist.artist_id}>
                {artist.stage_name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="date"
            placeholder="Release Date"
            value={formData.release_date}
            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Total Tracks"
            value={formData.total_tracks}
            onChange={(e) => setFormData({ ...formData, total_tracks: e.target.value })}
            min="1"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Adding...' : 'Add Album'}
        </button>
      </form>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>All Albums ({albums.length})</h3>
        {albums.length === 0 ? (
          <p style={{ color: '#666' }}>No albums yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {albums.map((album) => (
              <li
                key={album.album_id}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <strong>{album.title}</strong>
                <div style={{ fontSize: '0.9em', color: '#888', marginTop: '4px' }}>
                  by {album.artist_name || 'Unknown Artist'}
                </div>
                {album.release_date && (
                  <div style={{ fontSize: '0.85em', color: '#999' }}>
                    Released: {new Date(album.release_date).toLocaleDateString()}
                  </div>
                )}
                {album.total_tracks && (
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    {album.total_tracks} track{album.total_tracks !== 1 ? 's' : ''}
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

export default Albums;

