import React, { useState, useEffect } from 'react';

const Albums = ({ apiUrl }) => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
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

  useEffect(() => {
    const filtered = albums.filter(album =>
      album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbums(filtered);
  }, [searchTerm, albums]);

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
      setFilteredAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingAlbum
        ? `${apiUrl}/albums/${editingAlbum.album_id}`
        : `${apiUrl}/albums`;
      const method = editingAlbum ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artist_id: parseInt(formData.artist_id)
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(editingAlbum ? '✅ Album updated' : '✅ Album added');
        resetForm();
        fetchAlbums();
      } else {
        console.error('❌ Failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;

    try {
      const response = await fetch(`${apiUrl}/albums/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Album deleted');
        fetchAlbums();
      }
    } catch (error) {
      console.error('❌ Error deleting album:', error);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title || '',
      release_date: album.release_date || '',
      total_tracks: album.total_tracks || '',
      artist_id: album.artist_id || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', release_date: '', total_tracks: '', artist_id: '' });
    setEditingAlbum(null);
    setShowForm(false);
  };

  const getReleaseAge = (releaseDate) => {
    if (!releaseDate) return null;
    const release = new Date(releaseDate);
    const now = new Date();
    const years = Math.floor((now - release) / (1000 * 60 * 60 * 24 * 365));
    if (years < 1) return 'less than a year ago';
    if (years === 1) return 'about a year ago';
    if (years < 2) return 'over a year ago';
    return `about ${years} years ago`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
          Albums
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Browse all albums in your catalog.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search albums by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
          />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        </div>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          + Add Album
        </button>
      )}

      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
            {editingAlbum ? 'Edit Album' : 'Add New Album'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Album Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <select
                value={formData.artist_id}
                onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              >
                <option value="">Select Artist *</option>
                {artists.map((artist) => (
                  <option key={artist.artist_id} value={artist.artist_id}>
                    {artist.stage_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="date"
                placeholder="Release Date"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="number"
                placeholder="Total Tracks"
                value={formData.total_tracks}
                onChange={(e) => setFormData({ ...formData, total_tracks: e.target.value })}
                min="1"
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Saving...' : editingAlbum ? 'Update Album' : 'Add Album'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredAlbums.map((album) => (
          <div
            key={album.album_id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '3rem',
              color: 'white'
            }}>
              🎵
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
              {album.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span>🎵</span>
              <span>{album.artist_name || 'Unknown Artist'}</span>
            </div>
            {album.release_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span>📅</span>
                <span>{getReleaseAge(album.release_date)}</span>
              </div>
            )}
            {album.total_tracks && (
              <div style={{ marginBottom: '1rem' }}>
                <button style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'default'
                }}>
                  {album.total_tracks} track{album.total_tracks !== 1 ? 's' : ''}
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(album)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Modify
              </button>
              <button
                onClick={() => handleDelete(album.album_id)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          {searchTerm ? 'No albums found matching your search.' : 'No albums yet. Add one above!'}
        </p>
      )}
    </div>
  );
};

export default Albums;
