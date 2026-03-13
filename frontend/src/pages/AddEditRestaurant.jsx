import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantAPI } from "../api/api";
import { useToast } from "../context/ToastContext";

const CUISINES  = ["Italian","Japanese","Mexican","Indian","Chinese","Vegan","French","Thai","American","Mediterranean","Seafood","Other"];
const PRICES    = ["$","$$","$$$","$$$$"];
const AMENITIES = ["WiFi","Outdoor Seating","Parking","Vegetarian Options","Delivery","Takeout","Reservations","Bar","Live Music","Pet Friendly","Wheelchair Accessible"];

function Sec({ icon, title, children }) {
  return (
    <div className="sec">
      <div className="sec-t"><span>{icon}</span>{title}</div>
      {children}
    </div>
  );
}

export default function AddRestaurant() {
  const navigate   = useNavigate();
  const toast      = useToast();
  const fileRef    = useRef(null);
  const [form, setForm] = useState({ name:"",cuisine:"Italian",city:"",state:"",address:"",price:"$$",desc:"",phone:"",hours:"",amenities:[] });
  const [photos, setPhotos]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const s = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleAm = (a) => setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) { toast("Name and city are required", "error"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v));
      photos.forEach(f => fd.append("photos", f));
      const res = await restaurantAPI.create(fd);
      toast("Restaurant added! 🎉", "success");
      navigate(`/restaurants/${res.data.id}`);
    } catch (e) {
      toast(e.response?.data?.detail || "Failed to save. Please try again.", "error");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page">
      <div className="wsm" style={{ padding:"26px 20px" }}>
        <button className="btn bg bs" onClick={() => navigate(-1)} style={{ marginBottom:14 }}>← Back</button>
        <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,marginBottom:4 }}>Add a Restaurant</h1>
        <p style={{ color:"var(--g500)",fontSize:".845rem",marginBottom:22 }}>Share a restaurant with the Tastlytics community</p>

        <form onSubmit={submit}>
          <Sec icon="📋" title="Basic Information">
            <div className="fg"><label className="lbl">Restaurant Name *</label><input className="inp" placeholder="e.g. Pasta Paradise" required value={form.name} onChange={e => s("name",e.target.value)} /></div>
            <div className="fr">
              <div className="fg"><label className="lbl">Cuisine Type</label><select className="sel" value={form.cuisine} onChange={e => s("cuisine",e.target.value)}>{CUISINES.map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="fg"><label className="lbl">Price Tier</label><select className="sel" value={form.price} onChange={e => s("price",e.target.value)}>{PRICES.map(p => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div className="fg"><label className="lbl">Description</label><textarea className="ta" placeholder="Describe the restaurant, vibe, signature dishes…" rows={4} value={form.desc} onChange={e => s("desc",e.target.value)} /></div>
          </Sec>

          <Sec icon="📍" title="Location">
            <div className="fg"><label className="lbl">Street Address</label><input className="inp" placeholder="123 Main Street" value={form.address} onChange={e => s("address",e.target.value)} /></div>
            <div className="fr">
              <div className="fg"><label className="lbl">City *</label><input className="inp" placeholder="San Francisco" required value={form.city} onChange={e => s("city",e.target.value)} /></div>
              <div className="fg"><label className="lbl">State</label><input className="inp" maxLength={2} placeholder="CA" value={form.state} onChange={e => s("state",e.target.value.toUpperCase())} /></div>
            </div>
          </Sec>

          <Sec icon="📞" title="Contact & Hours">
            <div className="fg"><label className="lbl">Phone (optional)</label><input className="inp" type="tel" placeholder="(415) 555-0123" value={form.phone} onChange={e => s("phone",e.target.value)} /></div>
            <div className="fg"><label className="lbl">Hours of Operation</label><textarea className="ta" rows={4} placeholder={"Mon–Fri: 11am–10pm\nSat–Sun: 12pm–11pm"} value={form.hours} onChange={e => s("hours",e.target.value)} /></div>
          </Sec>

          <Sec icon="✨" title="Amenities">
            <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
              {AMENITIES.map(a => (
                <button key={a} type="button" className={`chip${form.amenities.includes(a) ? " on" : ""}`} onClick={() => toggleAm(a)}>{a}</button>
              ))}
            </div>
          </Sec>

          <Sec icon="📸" title="Photos (optional)">
            <div onClick={() => fileRef.current?.click()} style={{ border:"2px dashed var(--b200)",borderRadius:12,padding:"26px",textAlign:"center",cursor:"pointer",background:"var(--b50)" }}>
              <div style={{ fontSize:"2rem",marginBottom:7 }}>🖼️</div>
              <div style={{ fontFamily:"var(--fh)",fontWeight:600,color:"var(--b600)" }}>Click to upload photos</div>
              <div style={{ fontSize:".76rem",color:"var(--g400)",marginTop:3 }}>JPG, PNG up to 5MB each</div>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={e => { const f=Array.from(e.target.files); setPhotos(f); setPreviews(f.map(x=>URL.createObjectURL(x))); }} />
            {previews.length > 0 && (
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(88px,1fr))",gap:8,marginTop:11 }}>
                {previews.map((p,i) => <img key={i} src={p} alt="" style={{ height:78,objectFit:"cover",borderRadius:9 }} />)}
              </div>
            )}
          </Sec>

          <div style={{ display:"flex",gap:9 }}>
            <button className="btn bp bl" type="submit" disabled={submitting}>{submitting ? "Saving…" : "🚀 Add Restaurant"}</button>
            <button className="btn bg bl" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
