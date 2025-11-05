import React, { useState, useEffect } from 'react';

const Concerts = ({ apiUrl }) => {
  const [concerts, setConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingConcert, setEditingConcert] = useState(null);
  const [formData, setFormData] = useState({
    concert_name: '',
    location: '',
    concert_date: '',
    ticket_price: '',
    artist_id: ''
  });

  useEffect(() => {
    fetchConcerts();
    fetchArtists();
  }, []);

  useEffect(() => {
    const filtered = concerts.filter(concert =>
      concert.concert_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConcerts(filtered);
  }, [searchTerm, concerts]);

  const fetchArtists = async () => {
    try {
      const response = await fetch(`${apiUrl}/artists`);
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchConcerts = async () => {
    try {
      const response = await fetch(`${apiUrl}/concerts`);
      const data = await response.json();
      setConcerts(data);
      setFilteredConcerts(data);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingConcert
        ? `${apiUrl}/concerts/${editingConcert.concert_id}`
        : `${apiUrl}/concerts`;
      const method = editingConcert ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artist_id: parseInt(formData.artist_id),
          ticket_price: formData.ticket_price ? parseFloat(formData.ticket_price) : null
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(editingConcert ? '✅ Concert updated' : '✅ Concert added');
        resetForm();
        fetchConcerts();
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
    if (!window.confirm('Are you sure you want to delete this concert?')) return;

    try {
      const response = await fetch(`${apiUrl}/concerts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Concert deleted');
        fetchConcerts();
      }
    } catch (error) {
      console.error('❌ Error deleting concert:', error);
    }
  };

  const handleEdit = (concert) => {
    setEditingConcert(concert);
    setFormData({
      concert_name: concert.concert_name || '',
      location: concert.location || '',
      concert_date: concert.concert_date || '',
      ticket_price: concert.ticket_price || '',
      artist_id: concert.artist_id || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ concert_name: '', location: '', concert_date: '', ticket_price: '', artist_id: '' });
    setEditingConcert(null);
    setShowForm(false);
  };

  const getStatus = (concertDate) => {
    if (!concertDate) return { status: 'Unknown', color: '#6b7280' };
    const date = new Date(concertDate);
    const now = new Date();
    return date > now
      ? { status: 'Upcoming', color: '#9333ea' }
      : { status: 'Past', color: '#2563eb' };
  };

  const calculateRevenue = (ticketPrice, attendees = 50000) => {
    if (!ticketPrice) return 0;
    return (parseFloat(ticketPrice) * attendees).toLocaleString();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
          Concerts
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Timeline of all concerts and events.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search concerts by name, location, or artist..."
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
          + Add Concert
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
            {editingConcert ? 'Edit Concert' : 'Add New Concert'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Concert Name *"
                value={formData.concert_name}
                onChange={(e) => setFormData({ ...formData, concert_name: e.target.value })}
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
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="date"
                placeholder="Concert Date"
                value={formData.concert_date}
                onChange={(e) => setFormData({ ...formData, concert_date: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Ticket Price"
                value={formData.ticket_price}
                onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                step="0.01"
                min="0"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
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
                {loading ? 'Saving...' : editingConcert ? 'Update Concert' : 'Add Concert'}
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

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {filteredConcerts.map((concert, index) => {
          const status = getStatus(concert.concert_date);
          return (
            <div key={concert.concert_id} style={{ position: 'relative', marginBottom: '2rem' }}>
              <div style={{
                position: 'absolute',
                left: '-2rem',
                top: '0.5rem',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                backgroundColor: status.color,
                border: '2px solid white',
                boxShadow: '0 0 0 2px ' + status.color
              }} />
              {index < filteredConcerts.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '1.5rem',
                  width: '2px',
                  height: 'calc(100% + 1rem)',
                  backgroundColor: '#e5e7eb'
                }} />
              )}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
                        {concert.concert_name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {concert.artist_name}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: status.color,
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {status.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date</div>
                      <div style={{ fontWeight: '500' }}>{concert.concert_date ? new Date(concert.concert_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Ticket Price</div>
                      <div style={{ fontWeight: '500' }}>${concert.ticket_price || '0'}</div>
                    </div>
                  </div>
                  {concert.ticket_price && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estimated Revenue</div>
                      <div style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '1.125rem' }}>
                        ${calculateRevenue(concert.ticket_price)}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {concert.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📍</span>
                        <span>{concert.location}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>👥</span>
                      <span>50,000 attendees</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => handleEdit(concert)}
                    style={{
                      padding: '0.5rem 1rem',
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
                    onClick={() => handleDelete(concert.concert_id)}
                    style={{
                      padding: '0.5rem 1rem',
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
            </div>
          );
        })}
      </div>

      {filteredConcerts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          {searchTerm ? 'No concerts found matching your search.' : 'No concerts yet. Add one above!'}
        </p>
      )}
    </div>
  );
};

export default Concerts;

