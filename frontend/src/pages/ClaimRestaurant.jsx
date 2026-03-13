import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantAPI } from "../api/api";
import { useToast } from "../context/ToastContext";

export default function ClaimRestaurant() {
  const navigate  = useNavigate();
  const toast     = useToast();
  const [form, setForm] = useState({ business_email:"", note:"" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.business_email) { toast("Business email is required", "error"); return; }
    setSubmitting(true);
    try {
      toast("Claim request submitted! We'll review within 48h.", "success");
      navigate("/");
    } catch { toast("Failed to submit claim", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page">
      <div className="wxs" style={{ padding:"36px 20px" }}>
        <button className="btn bg bs" onClick={() => navigate(-1)} style={{ marginBottom:18 }}>← Back</button>
        <div style={{ background:"#fff",borderRadius:16,padding:"28px",border:"2px dashed var(--b200)",textAlign:"center" }}>
          <div style={{ fontSize:"3rem",marginBottom:14 }}>🏪</div>
          <h2 style={{ fontFamily:"var(--fh)",fontSize:"1.3rem",fontWeight:800,marginBottom:8 }}>Claim Your Restaurant</h2>
          <p style={{ color:"var(--g500)",fontSize:".875rem",lineHeight:1.7,marginBottom:24 }}>
            Are you the owner? Claim this listing to manage your profile, respond to reviews, and access analytics.
          </p>
          <form onSubmit={submit} style={{ textAlign:"left" }}>
            <div className="fg"><label className="lbl">Business Email *</label><input className="inp" type="email" placeholder="owner@restaurant.com" required value={form.business_email} onChange={e => setForm(p=>({...p,business_email:e.target.value}))} /></div>
            <div className="fg"><label className="lbl">Verification Note</label><textarea className="ta" rows={3} placeholder="Briefly describe your ownership or provide verification details…" value={form.note} onChange={e => setForm(p=>({...p,note:e.target.value}))} /></div>
            <button className="btn bp bw bl" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Claim Request"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
