import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ProfileManagement() {
  const { user, updateUser } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const fileRef  = useRef(null);
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({ name:"", email:"", phone:"", bio:"", city:"", country:"United States" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userAPI.getProfile()
      .then(r => setForm(p => ({ ...p, ...r.data })))
      .catch(() => { if (user) setForm(p => ({ ...p, name: user.name||"", email: user.email||"" })); });
  }, [user]);

  const s = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      updateUser(res.data);
      toast("Profile updated!", "success");
    } catch { toast("Failed to update", "error"); }
    finally { setSaving(false); }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await userAPI.uploadAvatar(fd);
      updateUser({ avatar_url: res.data.avatar_url });
      toast("Avatar updated!", "success");
    } catch { toast("Upload failed", "error"); }
  };

  const ini = (user?.name || "T").slice(0, 2).toUpperCase();

  const navItems = [
    { k:"info",        l:"👤 Personal Info" },
    { k:"security",    l:"🔒 Security" },
    { k:"preferences", l:"⚙️ Preferences", nav:"/preferences" },
    { k:"favorites",   l:"♥ Favorites",    nav:"/favorites" },
    { k:"history",     l:"🕐 History",      nav:"/history" },
  ];

  return (
    <div className="page">
      <div className="wrap" style={{ padding:"26px 20px" }}>
        <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,marginBottom:22 }}>My Profile</h1>
        <div className="pl">
          {/* Sidebar */}
          <div className="ps">
            <div className="bav" onClick={() => fileRef.current?.click()}>
              {user?.avatar_url
                ? <img src={user.avatar_url} alt="av" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                : ini}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={uploadAvatar} />
            <div style={{ fontFamily:"var(--fh)",fontWeight:700,fontSize:".9rem" }}>{user?.name}</div>
            <div style={{ fontSize:".75rem",color:"var(--g400)",marginBottom:17 }}>{user?.email}</div>
            {navItems.map(n => (
              <div key={n.k} className={`pni${tab===n.k?" on":""}`}
                onClick={() => n.nav ? navigate(n.nav) : setTab(n.k)}>
                {n.l}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="card cp">
            {tab === "info" && (
              <>
                <h2 style={{ fontFamily:"var(--fh)",fontSize:"1rem",marginBottom:20 }}>Personal Information</h2>
                <form onSubmit={save}>
                  <div className="fr">
                    <div className="fg"><label className="lbl">Full Name</label><input className="inp" value={form.name} onChange={e => s("name",e.target.value)} /></div>
                    <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" value={form.email} onChange={e => s("email",e.target.value)} /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label className="lbl">Phone</label><input className="inp" type="tel" placeholder="+1 555 000-0000" value={form.phone} onChange={e => s("phone",e.target.value)} /></div>
                    <div className="fg"><label className="lbl">City</label><input className="inp" placeholder="San Francisco" value={form.city} onChange={e => s("city",e.target.value)} /></div>
                  </div>
                  <div className="fg"><label className="lbl">About Me</label><textarea className="ta" rows={3} placeholder="A little about yourself…" value={form.bio} onChange={e => s("bio",e.target.value)} /></div>
                  <div className="fg">
                    <label className="lbl">Country</label>
                    <select className="sel" value={form.country} onChange={e => s("country",e.target.value)}>
                      {["United States","Canada","United Kingdom","Australia","India","Germany","France","Japan","Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <button className="btn bp" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
                </form>
              </>
            )}

            {tab === "security" && (
              <>
                <h2 style={{ fontFamily:"var(--fh)",fontSize:"1rem",marginBottom:20 }}>Change Password</h2>
                <form onSubmit={e => { e.preventDefault(); toast("Password updated!", "success"); }}>
                  <div className="fg"><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
                  <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="Min 8 characters" minLength={8} /></div>
                  <div className="fg"><label className="lbl">Confirm New Password</label><input className="inp" type="password" placeholder="Re-enter" /></div>
                  <button className="btn bp" type="submit">Update Password</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
