import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setToken(res.data.token);
      toast.success("Login successful");
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const fields = [
    { name: "email", icon: <FaEnvelope />, type: "email" },
    { name: "password", icon: <FaLock />, type: "password" },
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{ minHeight: '100vh', paddingTop: '10vh', backgroundColor: 'inherit', paddingLeft: '1rem', paddingRight: '1rem' }}
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
        <h2 className="mb-4 text-center" style={{color:'#1e88e5'}}>Login</h2>
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
                autoComplete={name === "password" ? "current-password" : "email"}
              />
            </div>
          ))}
          <button type="submit" style={{color:'white', backgroundColor:'#1e88e5'  }} className="btn  w-100 mb-3">
            Login
          </button>
        </form>
        <div className="text-center">
          Don't have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
