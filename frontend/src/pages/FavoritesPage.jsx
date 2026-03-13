import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/api";
import RestaurantCard from "../components/RestaurantCard";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favs,    setFavs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getFavorites()
      .then(r => setFavs(r.data || []))
      .catch(() => setFavs([]))
      .finally(() => setLoading(false));
  }, []);

  const remove = (id) => setFavs(p => p.filter(f => f.id !== id));

  return (
    <div className="page">
      <div className="wrap" style={{ padding:"26px 20px" }}>
        <div style={{ marginBottom:22 }}>
          <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,marginBottom:4 }}>My Favorites</h1>
          {!loading && (
            <p style={{ color:"var(--g500)",fontSize:".845rem" }}>
              {favs.length} saved restaurant{favs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading ? (
          <div className="ctr"><div className="spin" /></div>
        ) : favs.length === 0 ? (
          <div className="ctr">
            <div style={{ fontSize:"2.8rem",opacity:.25 }}>♡</div>
            <div style={{ fontFamily:"var(--fh)",fontWeight:700,color:"var(--g600)" }}>No favorites yet</div>
            <div style={{ fontSize:".82rem",color:"var(--g400)" }}>Explore restaurants and tap ♡ to save them here</div>
            <button className="btn bp" style={{ marginTop:16 }} onClick={() => navigate("/")}>Explore Restaurants</button>
          </div>
        ) : (
          <div className="g3">
            {favs.map(r => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                isFaved={true}
                onToggle={(id, on) => { if (!on) remove(id); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
