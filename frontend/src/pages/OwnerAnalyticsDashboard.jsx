import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ownerAPI } from "../api/api";
import { StarDisplay } from "../components/Stars";

const MOCK_STATS = { total_reviews:47, avg_rating:4.3, profile_views:1240, total_favorites:89 };
const MOCK_RESTS = [
  { id:1, name:"Pasta Paradise", cuisine_type:"Italian", city:"San Francisco", avg_rating:4.5, review_count:28, price_tier:"$$",  is_open:true,  emoji:"🍝" },
  { id:5, name:"Dragon Palace",  cuisine_type:"Chinese", city:"San Francisco", avg_rating:4.2, review_count:19, price_tier:"$$",  is_open:true,  emoji:"🥡" },
];
const MOCK_REVIEWS = [
  { id:1, user:{name:"Sarah M."}, rating:5, comment:"Amazing pasta!",    restaurant:"Pasta Paradise", created_at:"2025-11-15" },
  { id:2, user:{name:"James K."}, rating:4, comment:"Great service.",    restaurant:"Dragon Palace",  created_at:"2025-11-10" },
  { id:3, user:{name:"Emily T."}, rating:5, comment:"Incredible food!",  restaurant:"Pasta Paradise", created_at:"2025-11-01" },
];

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [tab,   setTab]   = useState("overview");
  const [stats, setStats] = useState(null);
  const [rests, setRests] = useState([]);
  const [revs,  setRevs]  = useState([]);

  useEffect(() => {
    ownerAPI.getDashboard()
      .then(r => { setStats(r.data.stats||MOCK_STATS); setRests(r.data.restaurants||MOCK_RESTS); setRevs(r.data.recent_reviews||MOCK_REVIEWS); })
      .catch(() => { setStats(MOCK_STATS); setRests(MOCK_RESTS); setRevs(MOCK_REVIEWS); });
  }, []);

  const statCards = [
    { icon:"📝", label:"Total Reviews",    val: stats?.total_reviews   || 0 },
    { icon:"⭐", label:"Avg Rating",       val: (stats?.avg_rating||0).toFixed(1) },
    { icon:"👥", label:"Profile Views",    val: (stats?.profile_views||0).toLocaleString() },
    { icon:"♥", label:"Total Favorites",  val: stats?.total_favorites  || 0 },
  ];

  return (
    <div className="page">
      <div className="wrap" style={{ padding:"26px 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,marginBottom:3 }}>Owner Dashboard</h1>
            <p style={{ color:"var(--g500)",fontSize:".845rem" }}>Manage your restaurants and view performance</p>
          </div>
          <button className="btn bp bs" onClick={() => navigate("/add-restaurant")}>+ Add Restaurant</button>
        </div>

        {/* Stats */}
        <div className="g4" style={{ marginBottom:26 }}>
          {statCards.map(c => (
            <div key={c.label} className="scard">
              <div className="sic">{c.icon}</div>
              <div className="sv">{c.val}</div>
              <div className="sl">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[{k:"overview",l:"Overview"},{k:"restaurants",l:"My Restaurants"},{k:"reviews",l:"Reviews"}].map(t => (
            <div key={t.k} className={`tab${tab===t.k?" on":""}`} onClick={() => setTab(t.k)}>{t.l}</div>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="g2">
            <div className="card cp">
              <h3 style={{ fontFamily:"var(--fh)",fontSize:".95rem",marginBottom:14 }}>Recent Reviews</h3>
              {revs.slice(0,4).map(rev => (
                <div key={rev.id} style={{ display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--g100)" }}>
                  <div style={{ width:34,height:34,borderRadius:"50%",background:"var(--b100)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".78rem",fontWeight:700,color:"var(--b700)",flexShrink:0,fontFamily:"var(--fh)" }}>
                    {(rev.user?.name||"U").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize:".845rem",fontWeight:600 }}>{rev.user?.name}</div>
                    <div style={{ fontSize:".75rem",color:"var(--g400)",marginBottom:3 }}>{rev.restaurant}</div>
                    <StarDisplay rating={rev.rating} size=".8rem" />
                    <p style={{ fontSize:".8rem",color:"var(--g600)",marginTop:3 }}>{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card cp">
              <h3 style={{ fontFamily:"var(--fh)",fontSize:".95rem",marginBottom:14 }}>My Restaurants</h3>
              {rests.map(r => (
                <div key={r.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--g100)",cursor:"pointer" }}
                  onClick={() => navigate(`/restaurants/${r.id}`)}>
                  <span style={{ fontSize:"1.9rem" }}>{r.emoji||"🍽️"}</span>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:"var(--fh)",fontWeight:600,fontSize:".88rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.name}</div>
                    <div style={{ fontSize:".76rem",color:"var(--g500)" }}>{r.cuisine_type} · {r.city}</div>
                  </div>
                  <StarDisplay rating={r.avg_rating} count={r.review_count} size=".8rem" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants */}
        {tab === "restaurants" && (
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {rests.map(r => (
              <div key={r.id} style={{ background:"#fff",borderRadius:13,padding:"16px",border:"1px solid var(--g200)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
                <span style={{ fontSize:"2.1rem" }}>{r.emoji||"🍽️"}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"var(--fh)",fontWeight:700,fontSize:".93rem" }}>{r.name}</div>
                  <div style={{ fontSize:".78rem",color:"var(--g500)" }}>{r.cuisine_type} · {r.city} · {r.price_tier}</div>
                  <StarDisplay rating={r.avg_rating} count={r.review_count} size=".82rem" />
                </div>
                <span style={{ fontSize:".74rem",fontWeight:700,color:r.is_open?"var(--green)":"var(--red)" }}>● {r.is_open?"Open":"Closed"}</span>
                <div style={{ display:"flex",gap:7 }}>
                  <button className="btn bo bs" onClick={() => navigate(`/add-restaurant?edit=${r.id}`)}>Edit</button>
                  <button className="btn bp bs" onClick={() => navigate(`/restaurants/${r.id}`)}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {revs.map(rev => (
              <div key={rev.id} style={{ background:"#fff",borderRadius:13,padding:"15px",border:"1px solid var(--g200)" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8 }}>
                  <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:"var(--b100)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:".8rem",color:"var(--b700)",fontFamily:"var(--fh)" }}>
                      {(rev.user?.name||"U").slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily:"var(--fh)",fontWeight:600,fontSize:".875rem" }}>{rev.user?.name}</div>
                      <div style={{ fontSize:".74rem",color:"var(--g400)" }}>{rev.restaurant} · {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ""}</div>
                    </div>
                  </div>
                  <StarDisplay rating={rev.rating} size=".85rem" />
                </div>
                <p style={{ color:"var(--g700)",fontSize:".875rem",lineHeight:1.6 }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
