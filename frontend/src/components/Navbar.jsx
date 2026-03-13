// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthed, isOwner, logout } = useAuth();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user ? (user.name || user.email || 'U').slice(0, 2).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <NavLink to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🍴</div>
            ForkFinder
          </NavLink>

          {/* Center Links */}
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
              Explore
            </NavLink>
            {isAuthed && !isOwner && (
              <>
                <NavLink to="/favorites" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  ♡ Favorites
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  History
                </NavLink>
              </>
            )}
            {isOwner && (
              <NavLink to="/owner/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            {isAuthed ? (
              <>
                {!isOwner && (
                  <NavLink to="/add-restaurant" className="btn btn-outline btn-sm">
                    + Add Restaurant
                  </NavLink>
                )}
                <div className="dropdown" ref={ref}>
                  <div className="avatar" onClick={() => setOpen(o => !o)}>
                    {user?.avatar_url
                      ? <img src={user.avatar_url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                      : initials
                    }
                  </div>
                  {open && (
                    <div className="dropdown-menu">
                      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                        <div style={{ fontWeight:600, fontSize:'.9rem' }}>{user?.name}</div>
                        <div style={{ fontSize:'.8rem', color:'var(--text-muted)' }}>{user?.email}</div>
                      </div>
                      <div className="dropdown-item" onClick={() => { navigate('/profile'); setOpen(false); }}>
                        👤 Profile
                      </div>
                      {!isOwner && (
                        <div className="dropdown-item" onClick={() => { navigate('/ai-assistant'); setOpen(false); }}>
                          🤖 AI Assistant
                        </div>
                      )}
                      {isOwner && (
                        <div className="dropdown-item" onClick={() => { navigate('/owner/dashboard'); setOpen(false); }}>
                          📊 Dashboard
                        </div>
                      )}
                      <div className="dropdown-divider" />
                      <div className="dropdown-item" onClick={handleLogout} style={{ color:'var(--red-500)' }}>
                        🚪 Logout
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost btn-sm">Log in</NavLink>
                <NavLink to="/signup" className="btn btn-primary btn-sm">Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
