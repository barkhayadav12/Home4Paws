import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaTrash } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/user/profile', {
      headers: { Authorization: token }
    }).then(res => {
      setUser(res.data.user);
    }).catch(() => {
      toast.error('Failed to fetch profile');
    });
    axios.get('http://localhost:5000/api/pets/all', {
      headers: { Authorization: token }
    }).then(res => {
      const currentUserId = JSON.parse(atob(token.split('.')[1])).id; 
      const owned = res.data.filter(p => {
        const ownerId = p.owner?._id || p.owner;
        return ownerId === currentUserId;
      });
      setUserPets(owned);
    }).catch(() => {
      toast.error('Failed to fetch user pets');
    });
  }, [token]);

  const handleDelete = async (petId) => {
    try {
      await axios.delete(`http://localhost:5000/api/pets/${petId}`, {
        headers: { Authorization: token }
      });
      toast.success("Pet deleted");
      setUserPets(prev => prev.filter(p => p._id !== petId));
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: '480px', fontFamily: "'Segoe UI', sans-serif" }}>
      <h2 className="mb-4 text-center" style={{ color: '#6C63FF', fontWeight: 700 }}>My Profile</h2>
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: '14px' }}>
        <h4 className="mb-4" style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>My Details</h4>
        <Detail icon={<FaUser color="#6C63FF" />} label="Name" value={user.name} />
        <Detail icon={<FaEnvelope color="#6C63FF" />} label="Email" value={user.email} />
        <Detail icon={<FaMapMarkerAlt color="#6C63FF" />} label="Address" value={user.address || 'Not provided'} />
        <Detail icon={<FaPhone color="#6C63FF" />} label="Phone" value={user.phone || 'Not provided'} />
      </div>
      <div className="card shadow-sm p-4" style={{ borderRadius: '14px' }}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>My Listed Pets</h5>
        {userPets.length === 0 ? (
          <p className="text-muted">You haven’t listed any pets yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {userPets.map(pet => (
              <li key={pet._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  🐾 <strong>{pet.name}</strong> was put up for adoption on{' '}
                  {new Date(pet.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(pet._id)}
                  title="Delete Pet"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
      <div style={{ marginRight: '12px' }}>{icon}</div>
      <span><strong>{label}:</strong> {value}</span>
    </div>
  );
}
