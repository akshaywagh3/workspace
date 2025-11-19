import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "You", text: "Welcome to the workspace! 🎉", isMine: true, time: "10:20 AM" },
    { id: 2, sender: "John", text: "Hello! Let’s begin our work.", isMine: false, time: "10:22 AM" },
  ]);
  const [input, setInput] = useState("");

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: input,
      isMine: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[75vh] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-indigo-300">Chat Room</h2>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-800 bg-gray-900 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium shadow-md"
        >
          Send
        </button>
      </div>

    </div>
  );
}
