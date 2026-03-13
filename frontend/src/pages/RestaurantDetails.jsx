import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantAPI, reviewAPI, userAPI } from "../api/api";
import { StarDisplay, StarPicker } from "../components/Stars";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EMOJI = { italian:"🍝",chinese:"🥡",mexican:"🌮",indian:"🍛",japanese:"🍣",american:"🍔",thai:"🍜",vegan:"🥗",french:"🥐",default:"🍽️" };

const MOCK_R = { id:1,name:"Pasta Paradise",cuisine_type:"Italian",city:"San Francisco, CA",address:"123 Columbus Ave, SF, CA 94133",phone:"(415) 555-0123",hours:"Mon–Thu: 11am–10pm\nFri–Sat: 11am–11pm\nSun: 12pm–9pm",avg_rating:4.5,review_count:128,price_tier:"$$",is_open:true,description:"Authentic Italian pasta made fresh daily with imported ingredients from Rome and Florence. Cozy atmosphere and an excellent wine list.",amenities:["WiFi","Outdoor Seating","Reservations","Vegetarian Options"] };
const MOCK_REV = [
  { id:1,user_id:98,user:{name:"Sarah M."},rating:5,comment:"Absolutely amazing pasta! Best carbonara outside of Rome. The gnocchi is also to die for.",created_at:"2025-11-15",avatar:"SM" },
  { id:2,user_id:97,user:{name:"James K."},rating:4,comment:"Great atmosphere and delicious food. Service was a little slow but completely worth the wait.",created_at:"2025-10-28",avatar:"JK" },
];

export default function RestaurantDetails() {
  const { id } = useParams();
  const { user, isAuthed } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const [rest,     setRest]     = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [faved,    setFaved]    = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [rating,   setRating]   = useState(0);
  const [comment,  setComment]  = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [rr, rev] = await Promise.all([restaurantAPI.get(id), reviewAPI.list(id)]);
        setRest(rr.data);
        setReviews(rev.data?.reviews || rev.data || []);
      } catch { setRest(MOCK_R); setReviews(MOCK_REV); }
      finally { setLoading(false); }
    })();
    if (isAuthed) userAPI.getFavorites().then(r => setFaved((r.data||[]).some(f => f.id === Number(id)))).catch(() => {});
  }, [id, isAuthed]);

  const toggleFav = async () => {
    if (!isAuthed) { navigate("/login"); return; }
    try {
      if (faved) { await userAPI.removeFavorite(id); setFaved(false); toast("Removed from favorites", "info"); }
      else       { await userAPI.addFavorite(id);    setFaved(true);  toast("Added to favorites! ♥", "success"); }
    } catch { toast("Could not update", "error"); }
  };

  const openEdit = (rev) => { setEditing(rev); setRating(rev.rating); setComment(rev.comment); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditing(null); setRating(0); setComment(""); };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) { toast("Please select a rating", "error"); return; }
    if (!comment.trim()) { toast("Please write a review", "error"); return; }
    setSubmitting(true);
    try {
      if (editing) {
        const res = await reviewAPI.update(editing.id, { rating, comment });
        setReviews(p => p.map(r => r.id === editing.id ? res.data : r));
        toast("Review updated!", "success");
      } else {
        const res = await reviewAPI.create(id, { rating, comment });
        setReviews(p => [res.data, ...p]);
        toast("Review submitted! ⭐", "success");
      }
      cancel();
    } catch { toast("Failed to submit", "error"); }
    finally { setSubmitting(false); }
  };

  const deleteReview = async (rid) => {
    if (!window.confirm("Delete this review?")) return;
    try { await reviewAPI.delete(rid); setReviews(p => p.filter(r => r.id !== rid)); toast("Deleted", "info"); }
    catch { toast("Could not delete", "error"); }
  };

  if (loading) return <div className="page ctr"><div className="spin" /></div>;
  if (!rest)   return <div className="page ctr"><div style={{ fontSize:"2.5rem",opacity:.3 }}>🍽️</div><div>Restaurant not found</div></div>;

  const emoji = EMOJI[rest.cuisine_type?.toLowerCase()] || EMOJI.default;
  const myReview = reviews.find(r => r.user_id === user?.id);

  return (
    <div className="page">
      {/* Hero image */}
      <div style={{ height:280,background:rest.photo_url?`url(${rest.photo_url}) center/cover`:"linear-gradient(135deg,var(--b100),var(--b200))",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
        {!rest.photo_url && <span style={{ fontSize:"5rem" }}>{emoji}</span>}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(11,20,55,.65) 0%,transparent 55%)",display:"flex",alignItems:"flex-end",padding:"22px 26px" }}>
          <div>
            <div style={{ display:"flex",gap:6,marginBottom:7 }}>
              <span className="badge bb" style={{ textTransform:"capitalize" }}>{rest.cuisine_type}</span>
              {rest.price_tier && <span className="badge bg2">{rest.price_tier}</span>}
              {rest.is_open !== undefined && (
                <span style={{ fontSize:".7rem",fontWeight:700,color:rest.is_open?"#bbf7d0":"#fecaca",padding:"2px 8px",background:rest.is_open?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)",borderRadius:99 }}>
                  ● {rest.is_open?"Open Now":"Closed"}
                </span>
              )}
            </div>
            <h1 style={{ color:"#fff",fontSize:"1.9rem",fontFamily:"var(--fh)",marginBottom:6 }}>{rest.name}</h1>
            <StarDisplay rating={rest.avg_rating} count={rest.review_count} size="1rem" />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ background:"#fff",borderBottom:"1px solid var(--g200)",padding:"10px 0" }}>
        <div className="wrap" style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
          <button className="btn bs" onClick={() => navigate(-1)}>← Back</button>
          <button className={`btn bs${faved?" bd":" bo"}`} onClick={toggleFav}>{faved?"♥ Saved":"♡ Save"}</button>
          {isAuthed && !myReview && !showForm && (
            <button className="btn bp bs" onClick={() => setShowForm(true)}>✏️ Write a Review</button>
          )}
          {isAuthed && myReview && !showForm && (
            <button className="btn bo bs" onClick={() => openEdit(myReview)}>✏️ Edit My Review</button>
          )}
        </div>
      </div>

      <div className="wrap" style={{ padding:"26px 20px" }}>
        <div className="dl">
          <div>
            {/* About */}
            {rest.description && (
              <div className="card cp" style={{ marginBottom:18 }}>
                <h3 style={{ fontFamily:"var(--fh)",marginBottom:10 }}>About</h3>
                <p style={{ color:"var(--g700)",lineHeight:1.7,fontSize:".9rem" }}>{rest.description}</p>
              </div>
            )}

            {/* Review form */}
            {showForm && (
              <div className="card cp" style={{ marginBottom:18,border:"2px solid var(--b200)" }}>
                <h3 style={{ fontFamily:"var(--fh)",marginBottom:18 }}>{editing ? "Edit Review" : "Write a Review"}</h3>
                <form onSubmit={submitReview}>
                  <div className="fg"><label className="lbl">Rating</label><StarPicker value={rating} onChange={setRating} /></div>
                  <div className="fg"><label className="lbl">Your Review</label><textarea className="ta" placeholder="Share your experience…" value={comment} onChange={e => setComment(e.target.value)} rows={4} required /></div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button className="btn bp" type="submit" disabled={submitting}>{submitting ? "Submitting…" : editing ? "Update Review" : "Submit Review"}</button>
                    <button className="btn bg" type="button" onClick={cancel}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews */}
            <h3 style={{ fontFamily:"var(--fh)",fontSize:"1rem",marginBottom:13 }}>Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <div className="ctr" style={{ padding:"36px 0" }}>
                <div style={{ fontSize:"2.5rem",opacity:.25 }}>💬</div>
                <div style={{ fontFamily:"var(--fh)",fontWeight:700,color:"var(--g600)" }}>No reviews yet</div>
                <div style={{ fontSize:".82rem",color:"var(--g400)" }}>Be the first to review!</div>
              </div>
            ) : reviews.map(rev => (
              <div key={rev.id} style={{ background:"#fff",borderRadius:13,padding:"15px",marginBottom:11,border:"1px solid var(--g200)" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8 }}>
                  <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                    <div style={{ width:37,height:37,borderRadius:"50%",background:"linear-gradient(135deg,var(--b500),#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".8rem",fontFamily:"var(--fh)",flexShrink:0 }}>
                      {rev.avatar || (rev.user?.name||"U").slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily:"var(--fh)",fontWeight:600,fontSize:".875rem" }}>{rev.user?.name || "Anonymous"}</div>
                      <div style={{ fontSize:".74rem",color:"var(--g400)" }}>{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ""}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    <StarDisplay rating={rev.rating} size=".85rem" />
                    {user?.id === rev.user_id && (
                      <div style={{ display:"flex",gap:4 }}>
                        <button className="btn bs bg" onClick={() => openEdit(rev)}>Edit</button>
                        <button className="btn bs" style={{ color:"var(--red)",background:"#fee2e2",borderRadius:"var(--r)" }} onClick={() => deleteReview(rev.id)}>Del</button>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ color:"var(--g700)",fontSize:".875rem",lineHeight:1.65 }}>{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="ds">
            <h3 style={{ fontFamily:"var(--fh)",fontWeight:700,marginBottom:13,fontSize:".95rem" }}>Restaurant Info</h3>
            {[
              { icon:"📍", label:"Address", val: rest.address || rest.city },
              rest.phone && { icon:"📞", label:"Phone", val: rest.phone, href:`tel:${rest.phone}` },
              rest.hours && { icon:"🕐", label:"Hours", val: rest.hours },
              rest.cuisine_type && { icon:"🍽️", label:"Cuisine", val: rest.cuisine_type, cap:true },
              { icon:"💰", label:"Price", val: rest.price_tier || "Not listed" },
            ].filter(Boolean).map(item => (
              <div key={item.label} className="ir">
                <div className="ii">{item.icon}</div>
                <div>
                  <div style={{ fontSize:".72rem",color:"var(--g400)",marginBottom:2 }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} style={{ color:"var(--b600)",fontSize:".845rem",fontWeight:500 }}>{item.val}</a>
                    : <div style={{ fontSize:".845rem",fontWeight:500,whiteSpace:"pre-line",textTransform:item.cap?"capitalize":"none" }}>{item.val}</div>
                  }
                </div>
              </div>
            ))}
            {rest.amenities?.length > 0 && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:".72rem",color:"var(--g400)",marginBottom:7 }}>Amenities</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                  {(Array.isArray(rest.amenities) ? rest.amenities : rest.amenities.split(",")).map((a,i) => (
                    <span key={i} className="badge bgr">{a.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
