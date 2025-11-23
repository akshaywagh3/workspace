import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import io from 'socket.io-client';

const SOCKET_URL = "http://localhost:5000";

export default function ChatSection({ chatId, workspaceId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⬅️ SOCKET CONNECTION + JOIN CHAT
  useEffect(() => {
    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") }
    });

    // Clear old listeners (avoid duplicates)
    socketRef.current.off("message:new");
    socketRef.current.off("message:read");

    // Join the chat
    socketRef.current.emit("JoinChat", { chatId });

    // Receive new messages
    socketRef.current.on("message:new", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Read receipts
    socketRef.current.on("message:read", ({ userId, lastReadMessageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id <= lastReadMessageId
            ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] }
            : m
        )
      );
    });

    return () => socketRef.current.disconnect();
  }, [chatId]);


  // ⬅️ SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = {
      chatId,
      content: input,
    };

    socketRef.current.emit("SendMessage", { payload }, (ack) => {
      if (ack?.success) setInput("");
    });
  };


  // ⬅️ MARK AS READ
  const markAsRead = () => {
    const last = messages[messages.length - 1];
    if (!last) return;

    socketRef.current.emit("read_messages", {
      chatId,
      lastReadMessageId: last._id,
    });
  };

  // Trigger markAsRead on message updates
  useEffect(() => {
    if (messages.length > 0) markAsRead();
  }, [messages]);


  return (
    <div className="flex flex-col h-[75vh] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-indigo-300">Chat Room</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
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
