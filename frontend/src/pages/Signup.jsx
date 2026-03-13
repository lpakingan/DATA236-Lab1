import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const { signup } = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name:"",email:"",password:"",confirm:"",phone:"",city:"",restName:"",restLoc:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const s = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (form.password !== form.confirm) { setErr("Passwords do not match"); return; }
    setLoading(true);
    try {
      const payload = role === "owner"
        ? { name: form.name, email: form.email, password: form.password, restaurant_name: form.restName, restaurant_location: form.restLoc }
        : { name: form.name, email: form.email, password: form.password, phone: form.phone, city: form.city };
      const u = await signup(payload, role === "owner");
      toast(`Welcome to Tastlytics, ${u.name}! 🎉`, "success");
      navigate(role === "owner" ? "/owner/dashboard" : "/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ap">
      <div className="al">
        <div style={{ position:"relative",zIndex:1 }}>
          <div className="logo" style={{ color:"#fff",marginBottom:32 }}><div className="logo-ic">📊</div>Tastlytics</div>
          <h1 style={{ color:"#fff",fontSize:"2.1rem",fontWeight:800,marginBottom:12,lineHeight:1.2 }}>Discover amazing food.</h1>
          <p style={{ color:"rgba(255,255,255,.7)",lineHeight:1.7 }}>Join thousands of food lovers discovering, reviewing, and connecting over great restaurants.</p>
        </div>
      </div>
      <div className="ar">
        <div className="af">
          <h2 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",marginBottom:5 }}>Create your account</h2>
          <p style={{ color:"var(--g500)",fontSize:".845rem",marginBottom:20 }}>Fill in the details to get started</p>

          <div className="rtabs">
            <div className={`rt${role==="user"?" on":""}`} onClick={() => setRole("user")}>👤 User / Reviewer</div>
            <div className={`rt${role==="owner"?" on":""}`} onClick={() => setRole("owner")}>🏪 Restaurant Owner</div>
          </div>

          <form onSubmit={submit}>
            <div className="fr">
              <div className="fg"><label className="lbl">Full Name</label><input className="inp" placeholder="Jane Doe" required value={form.name} onChange={e => s("name",e.target.value)} /></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@example.com" required value={form.email} onChange={e => s("email",e.target.value)} /></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="lbl">Password</label><input className="inp" type="password" placeholder="Min 8 chars" required minLength={8} value={form.password} onChange={e => s("password",e.target.value)} /></div>
              <div className="fg"><label className="lbl">Confirm Password</label><input className="inp" type="password" placeholder="Re-enter" required value={form.confirm} onChange={e => s("confirm",e.target.value)} /></div>
            </div>

            {role === "owner" ? (
              <>
                <div className="fg"><label className="lbl">Restaurant Name</label><input className="inp" placeholder="My Restaurant" required value={form.restName} onChange={e => s("restName",e.target.value)} /></div>
                <div className="fg"><label className="lbl">Restaurant Location</label><input className="inp" placeholder="123 Main St, City" required value={form.restLoc} onChange={e => s("restLoc",e.target.value)} /></div>
              </>
            ) : (
              <div className="fr">
                <div className="fg"><label className="lbl">Phone (optional)</label><input className="inp" type="tel" placeholder="+1 555 000-0000" value={form.phone} onChange={e => s("phone",e.target.value)} /></div>
                <div className="fg"><label className="lbl">City</label><input className="inp" placeholder="San Francisco" value={form.city} onChange={e => s("city",e.target.value)} /></div>
              </div>
            )}

            {err && <div style={{ background:"#fee2e2",borderRadius:9,padding:"9px 12px",fontSize:".82rem",color:"var(--red)",marginBottom:12 }}>⚠ {err}</div>}
            <button className="btn bp bw bl" type="submit" disabled={loading}>
              {loading ? "Creating account…" : `Create ${role === "owner" ? "Owner" : "User"} Account`}
            </button>
          </form>
          <p style={{ textAlign:"center",marginTop:18,fontSize:".845rem",color:"var(--g500)" }}>
            Already have an account? <Link to="/login" style={{ color:"var(--b600)",fontWeight:600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
