// src/components/StarRating.jsx
import React, { useState } from 'react';

// ── Display Only ─────────────────────────────────────────────
export function StarDisplay({ rating = 0, count, size = '1rem' }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize:'.82em', color:'var(--text-muted)', marginLeft:4 }}>({count})</span>
      )}
    </span>
  );
}

// ── Interactive ───────────────────────────────────────────────
export function StarPicker({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <span className="stars" style={{ fontSize:'1.8rem' }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={`star interactive ${i <= (hover || value) ? 'filled' : ''}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange && onChange(i)}
          role="button"
          tabIndex={0}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
          onKeyDown={e => e.key === 'Enter' && onChange && onChange(i)}
        >★</span>
      ))}
      {value > 0 && (
        <span style={{ fontSize:'1rem', color:'var(--text-muted)', marginLeft:8, verticalAlign:'middle' }}>
          {value}/5
        </span>
      )}
    </span>
  );
}
