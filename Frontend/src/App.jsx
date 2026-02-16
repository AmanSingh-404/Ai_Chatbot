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
      setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
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
    <div className="flex h-screen bg-[#212121] text-gray-100 font-sans overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-full max-w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-white/20 text-gray-100 bg-[#343541]">
          <span className="font-semibold">ChatGPT</span>
          <button className="p-2">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Top Model Selector (Visual) */}
        <div className="hidden md:flex w-full items-center p-4 text-gray-300 font-medium text-lg">
          <span className="cursor-pointer flex items-center gap-2 hover:bg-[#2f2f2f] px-3 py-1.5 rounded-md transition-colors">
            Your AI
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 1-10-10Z"></path><path d="M6.17 15.17A7 7 0 0 1 12 5.09a7 7 0 0 1 5.83 10.08"></path><path d="M12 2v6"></path><path d="M16.5 16.5 12 12 7.5 16.5"></path></svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h2>
            </div>
          ) : (
            <div className="flex flex-col pb-32 w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`w-full text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${msg.sender === 'bot' ? 'bg-[#444654]' : 'bg-[#343541] md:bg-transparent'
                    }`}
                >
                  <div className="max-w-3xl mx-auto flex gap-4 p-4 md:py-6 text-base">
                    <div className={`shrink-0 flex flex-col relative items-end`}>
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${msg.sender === 'bot' ? 'bg-green-500' : 'bg-[#5436DA]'
                        }`}>
                        {msg.sender === 'bot' ? (
                          <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 1-10-10Z"></path><path d="M12 12v6"></path><path d="m15 15-3-3-3 3"></path></svg>
                        ) : (
                          <span className="text-xs font-bold text-white">U</span>
                        )}
                      </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#000000] prose-pre:p-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative flex items-center w-full p-3 bg-[#40414f] rounded-xl shadow-xs border border-white/10 ring-offset-2 ring-offset-black/5 focus-within:ring-2 focus-within:ring-blue-500/50">
              <input
                className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder-gray-400 pl-2"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send a message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-md transition-colors ${inputValue.trim() ? 'bg-[#19c37d] text-white hover:bg-[#1a885d]' : 'bg-transparent text-gray-500 cursor-default'
                  }`}
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">YOUR AI can make mistakes. Consider checking important information.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;