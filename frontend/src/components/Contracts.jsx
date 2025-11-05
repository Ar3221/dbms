import React, { useState, useEffect } from 'react';

const Contracts = ({ apiUrl }) => {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [formData, setFormData] = useState({
    contract_type: '',
    management_fee: '',
    start_date: '',
    end_date: '',
    artist_id: ''
  });

  useEffect(() => {
    fetchContracts();
    fetchArtists();
  }, []);

  useEffect(() => {
    const filtered = contracts.filter(contract =>
      contract.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const fetchArtists = async () => {
    try {
      const response = await fetch(`${apiUrl}/artists`);
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${apiUrl}/contracts`);
      const data = await response.json();
      setContracts(data);
      setFilteredContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingContract
        ? `${apiUrl}/contracts/${editingContract.contract_id}`
        : `${apiUrl}/contracts`;
      const method = editingContract ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artist_id: parseInt(formData.artist_id),
          management_fee: formData.management_fee ? parseFloat(formData.management_fee) : null
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(editingContract ? '✅ Contract updated' : '✅ Contract added');
        resetForm();
        fetchContracts();
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
    if (!window.confirm('Are you sure you want to delete this contract?')) return;

    try {
      const response = await fetch(`${apiUrl}/contracts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Contract deleted');
        fetchContracts();
      }
    } catch (error) {
      console.error('❌ Error deleting contract:', error);
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      contract_type: contract.contract_type || '',
      management_fee: contract.management_fee || '',
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      artist_id: contract.artist_id || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ contract_type: '', management_fee: '', start_date: '', end_date: '', artist_id: '' });
    setEditingContract(null);
    setShowForm(false);
  };

  const getContractStatus = (endDate) => {
    if (!endDate) return { status: 'Unknown', color: '#6b7280', daysRemaining: null };
    const end = new Date(endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return { status: 'Expired', color: '#dc2626', daysRemaining: null };
    }
    return { status: 'Active', color: '#16a34a', daysRemaining };
  };

  const getContractProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return progress;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
          Contracts
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Manage artist contracts and track expiry dates.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search contracts by artist or type..."
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
          + Add Contract
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
            {editingContract ? 'Edit Contract' : 'Add New Contract'}
          </h3>
          <form onSubmit={handleSubmit}>
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
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Contract Type * (e.g., Full-Time Contract, Part-time Contract, Exclusive Contract)"
                value={formData.contract_type}
                onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Management Fee"
                value={formData.management_fee}
                onChange={(e) => setFormData({ ...formData, management_fee: e.target.value })}
                step="0.01"
                min="0"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="date"
                placeholder="Start Date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="date"
                placeholder="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                {loading ? 'Saving...' : editingContract ? 'Update Contract' : 'Add Contract'}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredContracts.map((contract) => {
          const status = getContractStatus(contract.end_date);
          const progress = getContractProgress(contract.start_date, contract.end_date);
          
          return (
            <div
              key={contract.contract_id}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                border: status.status === 'Expired' ? '2px solid #dc2626' : '1px solid #e5e7eb'
              }}
            >
              <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>📄</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
                    {contract.artist_name}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {contract.contract_type}
                  </p>
                  {contract.management_fee && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Management Fee: </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                        ${parseFloat(contract.management_fee).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Contract Progress</div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: status.status === 'Expired' ? '#dc2626' : '#2563eb',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span>📅</span>
                    <span>Start: {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span>📅</span>
                    <span>End: {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
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
                  {status.daysRemaining !== null && (
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {status.daysRemaining} days remaining
                    </span>
                  )}
                  {status.status === 'Expired' && (
                    <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>Expired</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(contract)}
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
                    onClick={() => handleDelete(contract.contract_id)}
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

      {filteredContracts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          {searchTerm ? 'No contracts found matching your search.' : 'No contracts yet. Add one above!'}
        </p>
      )}
    </div>
  );
};

export default Contracts;

