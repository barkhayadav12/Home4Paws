import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success("Registered successfully");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Error during registration");
    }
  };

  const fields = [
    { name: "name", icon: <FaUser />, type: "text" },
    { name: "email", icon: <FaEnvelope />, type: "email" },
    { name: "phone", icon: <FaPhone />, type: "tel" },
    { name: "address", icon: <FaHome />, type: "text" },
    { name: "password", icon: <FaLock />, type: "password" },
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '85vh', padding: '1rem',marginTop: '-1rem'  }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '2rem',
          backgroundColor: 'white',
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: '#1e88e5' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(({ name, icon, type }) => (
            <div key={name} className="input-group mb-3">
              <span className="input-group-text bg-light">{icon}</span>
              <input
                type={type}
                className="form-control"
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                value={form[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                required
                autoComplete={name === 'password' ? 'new-password' : 'off'}
              />
            </div>
          ))}
          <button type="submit" style={{color:'white', backgroundColor:'#1e88e5'  }} className="btn  w-100 mb-3">
            Register
          </button>
        </form>
        <div className="text-center">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
