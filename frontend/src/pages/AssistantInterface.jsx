import React, { useState } from 'react';
import axios from 'axios';

const AssistantInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false); // [cite: 171]

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', message: input };
        setMessages([...messages, userMsg]);
        setIsThinking(true);

        try {
            // POST to /ai-assistant/chat as per requirement [cite: 152]
            const response = await axios.post('http://localhost:8000/ai-assistant/chat', {
                message: input,
                conversation_history: messages
            });
            setMessages(prev => [...prev, { role: 'assistant', ...response.data }]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsThinking(false);
            setInput("");
        }
    };

    return (
        <div className="card shadow-sm p-3">
            <h3>AI Assistant</h3>
            <div className="chat-window border rounded p-2 mb-3" style={{ height: '350px', overflowY: 'auto' }}>
                {messages.map((m, i) => (
                    <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-end' : 'text-start'}`}>
                        <span className={`p-2 rounded d-inline-block ${m.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                            {m.message}
                        </span>
                    </div>
                ))}
                {isThinking && <div className="text-muted small">AI is thinking...</div>}
            </div>
            <div className="input-group">
                <input 
                    className="form-control" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Ask for recommendations..." 
                />
                <button className="btn btn-danger" onClick={handleSend}>Ask</button>
            </div>
        </div>
    );
};

export default AssistantInterface;
