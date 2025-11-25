import React, { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ChatSection({ chatId, workspaceId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const socketRef = useRef(null);
  const messageEndRef = useRef(null);
  const scrollRef = useRef(null);

  const PAGE_LIMIT = 20;

  // ⬅️ LOAD MESSAGES (PAGED)
  const loadMessages = useCallback(
    async (beforeId = null) => {
      if (!chatId || (!hasMore && beforeId)) return;

      try {
        if (beforeId) setLoadingMore(true);
        else setLoading(true);

        const res = await axios.get(
          `${API_BASE}/chat/${chatId}/messages`,
          {
            params: { beforeId, limit: PAGE_LIMIT ,userid : currentUser},
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (res.data.success) {
          const newMessages = res.data.messages || [];

          if (beforeId) {
            setMessages((prev) => [...newMessages, ...prev]);
            if (newMessages.length < PAGE_LIMIT) setHasMore(false);
          } else {
            setMessages(newMessages);
            setHasMore(newMessages.length === PAGE_LIMIT);
          }
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [chatId, hasMore]
  );

  // ⬅️ AUTO SCROLL
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⬅️ SOCKET CONNECTION + JOIN CHAT
  useEffect(() => {
    if (!chatId) return;

    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.off("message:new");
    socketRef.current.off("message:read");

    socketRef.current.emit("JoinChat", { chatId });

    // New message received
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

  // ⬅️ INITIAL LOAD
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // ⬅️ LOAD MORE ON SCROLL TOP
  const handleScroll = () => {
    if (!scrollRef.current || loadingMore || !hasMore) return;

    if (scrollRef.current.scrollTop < 50) {
      // Load older messages
      const oldestId = messages[0]?._id;
      if (oldestId) loadMessages(oldestId);
    }
  };

  // ⬅️ SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const payload = { chatId, content: input };

    socketRef.current.emit("SendMessage", { payload }, (ack) => {
      if (ack?.success) setInput("");
    });
  };

  // ⬅️ MARK AS READ
  const markAsRead = () => {
    const last = messages[messages.length - 1];
    if (!last || !socketRef.current) return;

    socketRef.current.emit("read_messages", {
      chatId,
      lastReadMessageId: last._id,
    });
  };

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
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {loading && <p className="text-gray-400 text-center">Loading messages...</p>}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
        ))}
        {loadingMore && <p className="text-gray-400 text-center">Loading more...</p>}
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
