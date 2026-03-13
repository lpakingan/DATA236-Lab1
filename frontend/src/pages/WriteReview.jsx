import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reviewAPI } from "../api/api";
import { StarPicker } from "../components/Stars";
import { useToast } from "../context/ToastContext";

const LABELS = { 1:"Poor", 2:"Fair", 3:"Good", 4:"Very Good", 5:"Excellent" };

export default function WriteReview() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const toast     = useToast();
  const [rating,   setRating]   = useState(0);
  const [comment,  setComment]  = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) { toast("Please select a rating", "error"); return; }
    if (!comment.trim()) { toast("Please write a review", "error"); return; }
    setSubmitting(true);
    try {
      await reviewAPI.create(id, { rating, comment });
      toast("Review submitted! ⭐", "success");
      navigate(`/restaurants/${id}`);
    } catch (e) {
      toast(e.response?.data?.detail || "Failed to submit", "error");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page">
      <div className="wxs" style={{ padding:"34px 20px" }}>
        <button className="btn bg bs" onClick={() => navigate(-1)} style={{ marginBottom:16 }}>← Back</button>
        <div className="card cp">
          <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.4rem",fontWeight:800,marginBottom:5 }}>Write a Review</h1>
          <p style={{ color:"var(--g500)",fontSize:".845rem",marginBottom:22 }}>Share your honest experience to help others.</p>
          <form onSubmit={submit}>
            <div className="fg">
              <label className="lbl">Overall Rating</label>
              <div style={{ display:"flex",alignItems:"center",gap:11 }}>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && <span style={{ fontFamily:"var(--fh)",fontWeight:600,color:"var(--amber)",fontSize:".9rem" }}>{LABELS[rating]}</span>}
              </div>
            </div>
            <div className="fg">
              <label className="lbl">Your Review</label>
              <textarea className="ta" rows={6} placeholder="What did you love (or not love)? How was the food, service, and atmosphere?" value={comment} onChange={e => setComment(e.target.value)} required />
              <div style={{ fontSize:".73rem",color:"var(--g400)",marginTop:3 }}>{comment.length} characters</div>
            </div>
            <div style={{ display:"flex",gap:9 }}>
              <button className="btn bp bl" type="submit" disabled={submitting || !rating}>{submitting ? "Submitting…" : "Submit Review"}</button>
              <button className="btn bg bl" type="button" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
