import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login }   = useAuth();
  const toast       = useToast();
  const navigate    = useNavigate();
  const [role, setRole]       = useState("user");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const u = await login({ email, password }, role === "owner");
      toast(`Welcome back, ${u.name}! 👋`, "success");
      navigate(role === "owner" ? "/owner/dashboard" : "/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="ap">
      <div className="al">
        <div style={{ position:"relative",zIndex:1 }}>
          <div className="logo" style={{ color:"#fff",marginBottom:32,textDecoration:"none" }}>
            <div className="logo-ic">📊</div>Tastlytics
          </div>
          <h1 style={{ color:"#fff",fontSize:"2.1rem",fontWeight:800,marginBottom:12,lineHeight:1.2 }}>Welcome back!</h1>
          <p style={{ color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:26 }}>
            Sign in to access your reviews, favorites, and AI-powered restaurant recommendations.
          </p>
          {["🤖 AI-powered recommendations","⭐ Discover top-rated spots","❤️ Save your favorites","📝 Share your experiences"].map(f => (
            <div key={f} style={{ display:"flex",alignItems:"center",gap:9,color:"rgba(255,255,255,.8)",fontSize:".845rem",marginBottom:9 }}>
              <span>{f.slice(0,2)}</span><span>{f.slice(3)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ar">
        <div className="af">
          <h2 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",marginBottom:5 }}>Log in to your account</h2>
          <p style={{ color:"var(--g500)",fontSize:".845rem",marginBottom:20 }}>Enter your credentials below</p>

          <div className="rtabs">
            <div className={`rt${role==="user"?" on":""}`} onClick={() => setRole("user")}>👤 User</div>
            <div className={`rt${role==="owner"?" on":""}`} onClick={() => setRole("owner")}>🏪 Owner</div>
          </div>

          <form onSubmit={submit}>
            <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="fg"><label className="lbl">Password</label><input className="inp" type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} /></div>
            {err && <div style={{ background:"#fee2e2",borderRadius:9,padding:"9px 12px",fontSize:".82rem",color:"var(--red)",marginBottom:12 }}>⚠ {err}</div>}
            <button className="btn bp bw bl" type="submit" disabled={loading}>
              {loading ? "Logging in…" : `Log in as ${role === "owner" ? "Owner" : "User"}`}
            </button>
          </form>

          <p style={{ textAlign:"center",marginTop:18,fontSize:".845rem",color:"var(--g500)" }}>
            Don't have an account? <Link to="/signup" style={{ color:"var(--b600)",fontWeight:600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
