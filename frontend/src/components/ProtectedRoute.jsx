// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, ownerOnly = false }) {
  const { user, isAuthed, isOwner, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="loading-center" style={{ height:'100vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
  if (ownerOnly && !isOwner) return <Navigate to="/" replace />;
  return children;
}

// ── 404 Page ────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="page-content flex-center" style={{ flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:'6rem', lineHeight:1 }}>🍽️</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:800, color:'var(--gray-900)' }}>404</h1>
      <p style={{ color:'var(--text-muted)', fontSize:'1.05rem' }}>Oops, this page isn't on the menu.</p>
      <a href="/" className="btn btn-primary">Back to Explore</a>
    </div>
  );
}

// ── Favorites Quick Page ─────────────────────────────────────
export function FavoritesPage() {
  const [favs, setFavs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = require('react-router-dom').useNavigate();
  const { userAPI } = require('../api/api');

  React.useEffect(() => {
    import('../api/api').then(({ userAPI }) => {
      userAPI.getFavorites()
        .then(r => setFavs(r.data || []))
        .catch(() => setFavs([]))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="page-content">
      <div className="container" style={{ padding:'32px 24px' }}>
        <h1 className="section-header">My Favorites</h1>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : favs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>No favorites yet</h3>
            <p>Explore restaurants and tap ♡ to save your favorites</p>
            <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => navigate('/')}>Explore Restaurants</button>
          </div>
        ) : (
          <div className="restaurants-grid">
            {favs.map(f => (
              <div key={f.id} className="card" style={{ padding:18, cursor:'pointer' }} onClick={() => navigate(`/restaurants/${f.id}`)}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:4 }}>{f.name}</div>
                <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>{f.cuisine_type} · {f.city}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
