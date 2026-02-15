import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { io } from "socket.io-client";
import ReactMarkdown from "react-markdown";


const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const socket = useRef(null)

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');

      if (socket.current) {
        socket.current.emit("ai-message", {
          prompt: inputValue
        })
      }
    }

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000")
    socket.current = socketInstance

    socketInstance.on("ai-message-response", ({ response }) => {

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'

      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat Application
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;