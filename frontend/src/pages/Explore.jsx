import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import { restaurantAPI, userAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

const CUISINES = ["All","Italian","Japanese","Mexican","Indian","Chinese","Vegan","French","Thai","Mediterranean","American","Seafood"];
const SORT_OPTS = [{ v:"rating",l:"⭐ Top Rated" },{ v:"newest",l:"🆕 Newest" },{ v:"price_asc",l:"💰 Price ↑" },{ v:"price_desc",l:"💰 Price ↓" }];

const MOCK = [
  { id:1, name:"Pasta Paradise",  cuisine_type:"Italian",       city:"San Francisco", avg_rating:4.5, review_count:128, price_tier:"$$",  is_open:true,  description:"Handmade pasta with imported Italian ingredients and a cozy atmosphere." },
  { id:2, name:"Sakura Sushi",    cuisine_type:"Japanese",      city:"San Francisco", avg_rating:4.7, review_count:204, price_tier:"$$$", is_open:true,  description:"Award-winning omakase. Fresh fish flown in daily." },
  { id:3, name:"Taco Fiesta",     cuisine_type:"Mexican",       city:"Oakland",       avg_rating:4.3, review_count:87,  price_tier:"$",   is_open:false, description:"Vibrant street tacos and fresh margaritas. Authentic family recipes." },
  { id:4, name:"Spice Route",     cuisine_type:"Indian",        city:"San Jose",      avg_rating:4.6, review_count:156, price_tier:"$$",  is_open:true,  description:"Traditional curries with a modern twist. Try the butter chicken." },
  { id:5, name:"Dragon Palace",   cuisine_type:"Chinese",       city:"San Francisco", avg_rating:4.2, review_count:312, price_tier:"$$",  is_open:true,  description:"Classic dim sum brunch and Cantonese dinner since 1987." },
  { id:6, name:"Green Leaf Café", cuisine_type:"Vegan",         city:"Berkeley",      avg_rating:4.4, review_count:93,  price_tier:"$",   is_open:true,  description:"100% plant-based seasonal menu. Creative dishes for everyone." },
  { id:7, name:"Le Bistro Bleu",  cuisine_type:"French",        city:"San Francisco", avg_rating:4.8, review_count:67,  price_tier:"$$$$",is_open:true,  description:"Refined French cuisine with California sensibilities." },
  { id:8, name:"Thai Orchid",     cuisine_type:"Thai",          city:"Oakland",       avg_rating:4.1, review_count:145, price_tier:"$",   is_open:true,  description:"Authentic Thai street food — pad thai, curries, spring rolls." },
];

export default function Explore() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [favs, setFavs]   = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [cityInput,   setCityInput]   = useState("");
  const [q,       setQ]       = useState("");
  const [city,    setCity]    = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [sort,    setSort]    = useState("rating");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...(q && { q }), ...(cuisine !== "All" && { cuisine_type: cuisine }), ...(city && { city }), sort };
      const res = await restaurantAPI.list(params);
      setRestaurants(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } catch { setRestaurants(MOCK); }
    finally { setLoading(false); }
  }, [q, city, cuisine, sort]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (isAuthed) userAPI.getFavorites().then(r => setFavs(new Set((r.data || []).map(f => f.id)))).catch(() => {});
  }, [isAuthed]);

  const toggleFav = (id, on) => setFavs(p => { const n = new Set(p); on ? n.add(id) : n.delete(id); return n; });

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="hcont">
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",padding:"4px 13px",borderRadius:99,color:"rgba(255,255,255,.9)",fontSize:".75rem",marginBottom:14 }}>
              📊 Discover · Review · Analyze
            </div>
            <h1>Find your next <span>favorite restaurant</span></h1>
            <p>Explore restaurants, read honest reviews, and let AI guide your next bite.</p>
            <form className="sbox" onSubmit={e => { e.preventDefault(); setQ(searchInput); setCity(cityInput); }}>
              <input placeholder="Restaurant, cuisine, keyword…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
              <div className="sdiv" />
              <input placeholder="City…" value={cityInput} onChange={e => setCityInput(e.target.value)} style={{ width:130, padding:"13px 12px", border:"none" }} />
              <button type="submit" className="sbtn">🔍 Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* AI Banner */}
      {isAuthed && (
        <div style={{ background:"linear-gradient(90deg,var(--b700),#06b6d4)", padding:"13px 0" }}>
          <div className="wrap" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:9 }}>
            <div style={{ display:"flex",alignItems:"center",gap:11 }}>
              <span style={{ fontSize:"1.6rem" }}>🤖</span>
              <div>
                <div style={{ color:"#fff",fontFamily:"var(--fh)",fontWeight:700,fontSize:".88rem" }}>AI Food Assistant</div>
                <div style={{ color:"rgba(255,255,255,.7)",fontSize:".75rem" }}>Personalized picks based on your preferences</div>
              </div>
            </div>
            <button className="btn" onClick={() => navigate("/assistant")} style={{ background:"#fff",color:"var(--b600)",fontSize:".82rem",padding:"7px 15px" }}>Open Chat →</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ background:"#fff",borderBottom:"1px solid var(--g200)",padding:"11px 0" }}>
        <div className="wrap" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:9 }}>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {CUISINES.map(c => (
              <button key={c} className={`chip${cuisine === c ? " on" : ""}`} onClick={() => setCuisine(c)}>{c}</button>
            ))}
          </div>
          <select className="sel" style={{ width:"auto",padding:"7px 11px",fontSize:".8rem" }} value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="wrap" style={{ padding:"26px 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
          <div>
            <span style={{ fontFamily:"var(--fh)",fontWeight:700,fontSize:"1.1rem" }}>
              {q ? `Results for "${q}"` : "Restaurants near you"}
            </span>
            {!loading && <span style={{ fontSize:".8rem",color:"var(--g500)",marginLeft:9 }}>{restaurants.length} found</span>}
          </div>
        </div>

        {loading ? (
          <div className="ctr"><div className="spin" /><span style={{ color:"var(--g500)",fontSize:".875rem" }}>Finding restaurants…</span></div>
        ) : restaurants.length === 0 ? (
          <div className="ctr">
            <div style={{ fontSize:"2.8rem",opacity:.28 }}>🍽️</div>
            <div style={{ fontFamily:"var(--fh)",fontWeight:700,color:"var(--g600)" }}>No restaurants found</div>
            <div style={{ fontSize:".82rem",color:"var(--g400)" }}>Try different keywords or filters</div>
          </div>
        ) : (
          <div className="g3">
            {restaurants.map(r => (
              <RestaurantCard key={r.id} restaurant={r} isFaved={favs.has(r.id)} onToggle={toggleFav} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
