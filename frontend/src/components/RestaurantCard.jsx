// src/components/RestaurantCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarDisplay } from './StarRating';
import { userAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CUISINE_EMOJI = {
  italian: '🍝', chinese: '🥡', mexican: '🌮', indian: '🍛',
  japanese: '🍣', american: '🍔', thai: '🍜', mediterranean: '🫒',
  french: '🥐', vegan: '🥗', seafood: '🦞', default: '🍽️',
};

export default function RestaurantCard({ restaurant, isFaved, onFavToggle }) {
  const navigate = useNavigate();
  const { isAuthed } = useAuth();

  const emoji = CUISINE_EMOJI[restaurant.cuisine_type?.toLowerCase()] || CUISINE_EMOJI.default;

  const handleFav = async (e) => {
    e.stopPropagation();
    if (!isAuthed) { navigate('/login'); return; }
    try {
      if (isFaved) await userAPI.removeFavorite(restaurant.id);
      else         await userAPI.addFavorite(restaurant.id);
      onFavToggle && onFavToggle(restaurant.id, !isFaved);
    } catch (_) {}
  };

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
      {/* Image / Placeholder */}
      {restaurant.photo_url ? (
        <img src={restaurant.photo_url} alt={restaurant.name} className="restaurant-card-img" />
      ) : (
        <div className="restaurant-card-img" aria-label={restaurant.cuisine_type}>
          {emoji}
        </div>
      )}

      <div className="restaurant-card-body">
        <div className="restaurant-card-name">{restaurant.name}</div>
        <div className="restaurant-card-meta">
          <span className="badge badge-blue" style={{ textTransform:'capitalize' }}>
            {restaurant.cuisine_type || 'Restaurant'}
          </span>
          <span style={{ fontSize:'.8rem', color:'var(--text-muted)' }}>
            📍 {restaurant.city || restaurant.location}
          </span>
        </div>

        <StarDisplay rating={restaurant.avg_rating} count={restaurant.review_count} />

        {restaurant.description && (
          <p style={{
            fontSize:'.82rem', color:'var(--text-muted)', marginTop:8,
            display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden'
          }}>
            {restaurant.description}
          </p>
        )}

        <div className="restaurant-card-footer">
          <span className="price-tag">
            {restaurant.price_tier || '$$'}
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {restaurant.is_open !== undefined && (
              <span style={{ fontSize:'.78rem', fontWeight:600, color: restaurant.is_open ? 'var(--green-500)' : 'var(--red-500)' }}>
                {restaurant.is_open ? '● Open' : '● Closed'}
              </span>
            )}
            <button
              className={`fav-btn ${isFaved ? 'active' : ''}`}
              onClick={handleFav}
              aria-label={isFaved ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFaved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
