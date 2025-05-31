import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setSidebarOpen(false);
    navigate('/');
  };
  useEffect(() => {
    const closeSidebar = () => setSidebarOpen(false);
    window.addEventListener('resize', closeSidebar);
    return () => window.removeEventListener('resize', closeSidebar);
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center fixed-navbar">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Home4Paws🐾
        </Link>
        <button
          className="btn btn-outline-light d-lg-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ms-auto d-none d-lg-flex flex-row gap-3 align-items-center">
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/login">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link fs-5" to="/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/donate-pet">Rehome Pet</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/request-help">Request Help</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/profile">Profile</Link></li>
              <li className="nav-item">
                <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <button
          className="btn-close btn-close-white sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
        <ul className="sidebar-nav">
          {!token ? (
            <>
              <li><Link onClick={() => setSidebarOpen(false)} to="/register">Register</Link></li>
              <li><Link onClick={() => setSidebarOpen(false)} to="/login">Login</Link></li>
            </>
          ) : (
            <>
              <li><Link onClick={() => setSidebarOpen(false)} to="/home">Home</Link></li>
              <li><Link onClick={() => setSidebarOpen(false)} to="/donate-pet">Rehome Pet</Link></li>
              <li><Link onClick={() => setSidebarOpen(false)} to="/request-help">Request Help</Link></li>
              <li><Link onClick={() => setSidebarOpen(false)} to="/profile">Profile</Link></li>
              <li>
                <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </aside>
      <style>{`
        /* Fixed navbar */
        .fixed-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          height: 64px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* Push content down */
        body {
          padding-top: 64px;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          width: 280px;
          background-color: #222;
          padding: 2rem 1.5rem;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1050;
          display: flex;
          flex-direction: column;
        }

        .sidebar.active {
          transform: translateX(0);
        }

        .sidebar-close-btn {
          align-self: flex-end;
          margin-bottom: 2rem;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin: 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sidebar-nav li a {
          color: #fff;
          font-size: 1.2rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .sidebar-nav li a:hover {
          color: #f8c291;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1040;
        }

        .sidebar-overlay.active {
          opacity: 1;
          pointer-events: all;
        }

        .btn-outline-light:hover,
        .btn-outline-light:focus {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
}

