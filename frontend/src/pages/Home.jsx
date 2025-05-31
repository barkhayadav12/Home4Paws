import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../App.css';

export default function Home() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:5000/api/pets/all', {
      headers: { Authorization: token }
    }).then(res => {
      setPets(res.data);
    }).catch(() => {
      toast.error("Unauthorized or failed to fetch pets");
    });

    axios.get('http://localhost:5000/api/auth/home', {
      headers: { Authorization: token }
    }).then(res => {
      setUserName(res.data.name || '');
      setUserId(res.data._id || '');
    }).catch(() => {});
  }, [token]);

  useEffect(() => {
    const owned = pets.filter(pet => {
      const ownerId = pet.owner?._id || pet.owner;
      return ownerId === userId;
    });
    const others = pets.filter(pet => {
      const ownerId = pet.owner?._id || pet.owner;
      return ownerId !== userId;
    });

    let filtered = others;
    if (breedFilter) {
      filtered = filtered.filter(p => p.breed === breedFilter);
    }
    if (addressFilter) {
      filtered = filtered.filter(p => p.address === addressFilter);
    }

    setUserPets(owned);
    setFilteredPets(filtered);
  }, [pets, userId, breedFilter, addressFilter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pets/${id}`, {
        headers: { Authorization: token }
      });
      toast.success("Pet deleted");
      setPets(pets.filter(p => p._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };
  const handleAdopt = async (pet) => {
    if (!token) {
      toast.error("Please login to adopt.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/pets/adopt/${pet._id}`, 
        {}, 
        { headers: { Authorization: token } }
      );
      toast.success(`Adoption request sent to owner of ${pet.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send adoption request");
    }
  };

  const uniqueBreeds = [...new Set(pets.map(p => p.breed).filter(Boolean))];
  const uniqueAddresses = [...new Set(pets.map(p => p.address).filter(Boolean))];

  const PetCard = ({ pet, isOwner }) => (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm pet-card">
        {pet.image && (
         <img
  src={`http://localhost:5000/uploads/${pet.image}`}
  className="card-img-top pet-image"
  alt={pet.name}
/>
        )}
        <div className="card-body">
          <h5 className="card-title">{pet.name}</h5>
          <p className="card-text text-muted small">
            <strong>Breed:</strong> {pet.breed}<br />
            <strong>Gender:</strong> {pet.gender}<br />
            <strong>Age:</strong> {pet.age}<br />
            <strong>Address:</strong> {pet.address}<br />
            <strong>Owner:</strong> {pet.owner?.name || 'Unknown'}<br />
            <small className="text-muted">Listed: {new Date(pet.createdAt).toLocaleDateString()}</small>
          </p>
          {isOwner ? (
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(pet._id)}>Delete</button>
          ) : (
            <button className="btn btn-outline-success btn-sm" onClick={() => handleAdopt(pet)}>Adopt Me</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 welcome-text"> Welcome, {userName}</h2>
      <div className="row mb-5 filters-section">
        <div className="col-md-6 mb-3">
          <label className="form-label">Filter by Breed:</label>
          <select
            className="form-select"
            value={breedFilter}
            onChange={e => setBreedFilter(e.target.value)}
          >
            <option value="">All Breeds</option>
            {uniqueBreeds.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Filter by Address:</label>
          <select
            className="form-select"
            value={addressFilter}
            onChange={e => setAddressFilter(e.target.value)}
          >
            <option value="">All Addresses</option>
            {uniqueAddresses.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <h4 className="section-title">🐾 Your Listed Pets</h4>
      <div className="row">
        {userPets.length === 0 ? <p className="text-muted ms-3">No pets listed by you.</p> :
          userPets.map(pet => (
            <PetCard key={pet._id} pet={pet} isOwner={true} />
          ))
        }
      </div>
      <h4 className="section-title mt-5">🐾 Pets Available for Adoption</h4>
      <div className="row">
        {filteredPets.length === 0 ? <p className="text-muted ms-3">No pets available for adoption.</p> :
          filteredPets.map(pet => (
            <PetCard key={pet._id} pet={pet} isOwner={false} />
          ))
        }
      </div>
    </div>
  );
}
