import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import { ToastContainer } from 'react-toastify';
import PetDonation from './pages/Donate';
import Profile from './pages/Profile';
import RequestHelp from './pages/RequestHelp';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar token={token} setToken={setToken} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/donate-pet" element={token ? <PetDonation /> : <Navigate to="/login" />} />
        <Route path="/request-help" element={token ? <RequestHelp userEmail={localStorage.getItem('email')} /> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

