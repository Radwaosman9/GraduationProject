import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newHistory = [...history, { type: 'outgoing', text: message }];
    setHistory(newHistory);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:8000/chat', { message });
      setHistory([...newHistory, { type: 'incoming', text: res.data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setHistory([...newHistory, { type: 'incoming', text: 'Error communicating with Google Gemini' }]);
    }
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="h2">Our Chat</div>
      </div>
      <div className="chat-body">
        {history.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-footer">
        <input
          placeholder="Type your message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
