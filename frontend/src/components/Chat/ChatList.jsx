import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ChatList() {
  const { workspaceId } = useParams();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, [workspaceId]);

  const loadChats = async () => {
    try {
      const res = await axios.get(
        `/api/workspaces/${workspaceId}/chats`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setChats(res.data.chats);
    } catch (e) {
      console.error("Failed to load chats", e);
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
      <h2 className="text-lg text-indigo-300 font-semibold mb-4">Chats</h2>

      <div className="space-y-2">
        {chats.map(chat => (
          <div
            key={chat._id}
            onClick={() => navigate(`/workspace/${workspaceId}/chat/${chat._id}`)}
            className="p-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer transition"
          >
            <div className="font-medium">{chat.name}</div>
            <div className="text-sm text-gray-400 truncate">
              {chat.lastMessage?.content || "No messages yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
