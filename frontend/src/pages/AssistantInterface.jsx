import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aiAPI } from "../api/api";
import { StarDisplay } from "../components/Stars";

const QUICK = ["Best nearby 🗺️","Cheap eats 💸","Top rated ⭐","Open now 🟢","Vegan options 🥗","Date night 🕯️"];

const MOCK_RECS = [
  { id:1, name:"Pasta Paradise",  cuisine:"Italian",  price:"$$",  rating:4.5 },
  { id:2, name:"Sakura Sushi",    cuisine:"Japanese", price:"$$$", rating:4.7 },
  { id:4, name:"Spice Route",     cuisine:"Indian",   price:"$$",  rating:4.6 },
  { id:6, name:"Green Leaf Café", cuisine:"Vegan",    price:"$",   rating:4.4 },
  { id:7, name:"Le Bistro Bleu",  cuisine:"French",   price:"$$$$",rating:4.8 },
  { id:8, name:"Thai Orchid",     cuisine:"Thai",     price:"$",   rating:4.1 },
];

const EMOJI = { italian:"🍝",japanese:"🍣",mexican:"🌮",indian:"🍛",chinese:"🥡",vegan:"🥗",french:"🥐",thai:"🍜",default:"🍽️" };

function getMockResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("vegan")||m.includes("plant")) return { text:"Great choice! Here are top plant-based spots:", recs:[MOCK_RECS[3]] };
  if (m.includes("sushi")||m.includes("japanese")) return { text:"For Japanese cuisine, this is my top pick:", recs:[MOCK_RECS[1]] };
  if (m.includes("cheap")||m.includes("budget")) return { text:"Here are some budget-friendly options:", recs:[MOCK_RECS[3],MOCK_RECS[5]] };
  if (m.includes("italian")||m.includes("pasta")) return { text:"For Italian, I highly recommend:", recs:[MOCK_RECS[0]] };
  if (m.includes("indian")||m.includes("curry")) return { text:"For Indian cuisine, try:", recs:[MOCK_RECS[2]] };
  if (m.includes("date")||m.includes("romantic")||m.includes("fine dining")) return { text:"For a romantic evening, consider:", recs:[MOCK_RECS[4]] };
  if (m.includes("top")||m.includes("best")||m.includes("rated")) return { text:"Here are our highest-rated restaurants:", recs:[MOCK_RECS[1],MOCK_RECS[4],MOCK_RECS[2]] };
  if (m.includes("open")) return { text:"These are currently open:", recs:[MOCK_RECS[0],MOCK_RECS[1],MOCK_RECS[2]] };
  return { text:"Based on your preferences, here are some great options!", recs:[MOCK_RECS[0],MOCK_RECS[1],MOCK_RECS[2]] };
}

export default function AssistantInterface() {
  const navigate = useNavigate();
  const msgsRef  = useRef(null);
  const [messages, setMessages] = useState([
    { role:"bot", text:"Hi! I'm your Tastlytics AI assistant 🤖\n\nTell me what you're craving, any dietary needs, or the occasion — and I'll find the perfect spot for you!" }
  ]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setMessages(p => [...p, { role:"me", text: msg }]);
    setTyping(true);

    // Try real API, fall back to mock
    try {
      const res = await aiAPI.chat({
        message: msg,
        conversation_history: messages.map(m => ({ role: m.role === "me" ? "user" : "assistant", content: m.text }))
      });
      const d = res.data;
      setMessages(p => [...p, { role:"bot", text: d.message, recs: d.recommendations }]);
    } catch {
      await new Promise(r => setTimeout(r, 900));
      const mock = getMockResponse(msg);
      setMessages(p => [...p, { role:"bot", text: mock.text, recs: mock.recs }]);
    } finally { setTyping(false); }
  };

  return (
    <div className="page">
      <div className="wrap" style={{ padding:"20px 20px" }}>
        <div style={{ marginBottom:14 }}>
          <h1 style={{ fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,marginBottom:3 }}>AI Food Assistant</h1>
          <p style={{ color:"var(--g500)",fontSize:".845rem" }}>Ask me anything about food, cravings, or occasions</p>
        </div>

        <div className="cw">
          {/* Header */}
          <div className="ch">
            <div style={{ width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem" }}>🤖</div>
            <div>
              <div style={{ color:"#fff",fontFamily:"var(--fh)",fontWeight:700,fontSize:".9rem" }}>Tastlytics AI</div>
              <div style={{ fontSize:".72rem",color:"rgba(255,255,255,.7)" }}>Powered by smart recommendations</div>
            </div>
            <div style={{ marginLeft:"auto",background:"rgba(255,255,255,.2)",color:"#fff",padding:"3px 11px",borderRadius:99,fontSize:".7rem",fontWeight:600 }}>● Online</div>
          </div>

          {/* Messages */}
          <div className="cm" ref={msgsRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`mr${msg.role==="me"?" me":""}`}>
                {msg.role === "bot" && <div className="bic">🤖</div>}
                <div>
                  <div className={`bub ${msg.role}`} style={{ whiteSpace:"pre-line" }}>{msg.text}</div>
                  {msg.recs?.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:5 }}>
                      {msg.recs.map(r => (
                        <button key={r.id} className="reco" onClick={() => navigate(`/restaurants/${r.id}`)}>
                          <span style={{ fontSize:"1.35rem",flexShrink:0 }}>
                            {EMOJI[(r.cuisine||r.cuisine_type||"").toLowerCase()] || EMOJI.default}
                          </span>
                          <div style={{ textAlign:"left",flex:1,minWidth:0 }}>
                            <div style={{ fontFamily:"var(--fh)",fontWeight:700,fontSize:".82rem" }}>{r.name}</div>
                            <div style={{ fontSize:".72rem",color:"var(--g500)",display:"flex",alignItems:"center",gap:6 }}>
                              {r.cuisine||r.cuisine_type} · {r.price||r.price_tier}
                              <StarDisplay rating={r.rating||r.avg_rating} size=".75rem" />
                            </div>
                            {r.reason && <div style={{ fontSize:".72rem",color:"var(--b600)",marginTop:2 }}>{r.reason}</div>}
                          </div>
                          <span style={{ color:"var(--b400)",fontSize:".9rem",flexShrink:0 }}>›</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="mr">
                <div className="bic">🤖</div>
                <div className="bub bot" style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex",gap:4,alignItems:"center" }}>
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="cia">
            <div className="qbs">
              {QUICK.map(q => (
                <button key={q} className="qb" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
            <div className="cir">
              <input
                ref={inputRef}
                className="cinp"
                placeholder="What are you craving tonight?"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              />
              <button className="csb" onClick={() => send()} disabled={typing}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
