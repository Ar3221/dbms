import React, { useState, useEffect } from 'react';

const Artists = ({ apiUrl }) => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
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

  useEffect(() => {
    const filtered = artists.filter(artist => 
      artist.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  const fetchArtists = async () => {
    try {
      const response = await fetch(`${apiUrl}/artists`);
      const data = await response.json();
      setArtists(data);
      setFilteredArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingArtist 
        ? `${apiUrl}/artists/${editingArtist.artist_id}`
        : `${apiUrl}/artists`;
      const method = editingArtist ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(editingArtist ? '✅ Artist updated' : '✅ Artist added');
        resetForm();
        fetchArtists();
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
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    try {
      const response = await fetch(`${apiUrl}/artists/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Artist deleted');
        fetchArtists();
      }
    } catch (error) {
      console.error('❌ Error deleting artist:', error);
    }
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    setFormData({
      first_name: artist.first_name || '',
      last_name: artist.last_name || '',
      stage_name: artist.stage_name || '',
      genre: artist.genre || '',
      debut_year: artist.debut_year || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ first_name: '', last_name: '', stage_name: '', genre: '', debut_year: '' });
    setEditingArtist(null);
    setShowForm(false);
  };

  const getYearsExperience = (debutYear) => {
    if (!debutYear) return null;
    return new Date().getFullYear() - parseInt(debutYear);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
          Artists
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Manage and view all artists.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search artists by name or genre..."
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
          + Add Artist
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
            {editingArtist ? 'Edit Artist' : 'Add New Artist'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Stage Name *"
                value={formData.stage_name}
                onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
                required
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="text"
                placeholder="Genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Debut Year"
                value={formData.debut_year}
                onChange={(e) => setFormData({ ...formData, debut_year: e.target.value })}
                min="1900"
                max="2100"
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '100%' }}
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
                {loading ? 'Saving...' : editingArtist ? 'Update Artist' : 'Add Artist'}
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredArtists.map((artist) => (
          <div
            key={artist.artist_id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>🎵</div>
              {artist.genre && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}>
                  {artist.genre}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
              {artist.stage_name}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {artist.first_name} {artist.last_name}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {artist.debut_year && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <span>📅</span>
                  <span>Debut: {artist.debut_year}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <span>⏰</span>
                <span>{getYearsExperience(artist.debut_year) || 'N/A'} Years Experience</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => handleEdit(artist)}
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
                onClick={() => handleDelete(artist.artist_id)}
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

      {filteredArtists.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          {searchTerm ? 'No artists found matching your search.' : 'No artists yet. Add one above!'}
        </p>
      )}
    </div>
  );
};

export default Artists;
