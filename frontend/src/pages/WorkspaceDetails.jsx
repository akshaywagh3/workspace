import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ClockIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ChatSection from "../components/Chat/ChatSection";
import axios from "axios";

export default function WorkspaceDetails() {
  const location = useLocation();
  const workspaceId = location.pathname.split("/")[2]; // 2 = 3rd segment in /workspace/6914ea79dd94116fc9b12b81

  console.log("workspaceId:", workspaceId);

  const [activeTab, setActiveTab] = useState("overview");
  const [workspace, setWorkspace] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(true);
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const userId = localStorage.getItem("userid");

  const tabs = [
    { id: "overview", label: "Overview", icon: HomeIcon },
    { id: "tasks", label: "Tasks", icon: RectangleStackIcon },
    { id: "notes", label: "Notes", icon: DocumentTextIcon },
    { id: "files", label: "Files", icon: FolderOpenIcon },
    { id: "activity", label: "Activity", icon: ClockIcon },
  ];

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const res = await axios.get(API_BASE+`/workspace/${workspaceId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setWorkspace(res.data.workspace);
        setChats(res.data.workspace.chats || []);
        if (res.data.workspace.chats?.length > 0) {
          setActiveChatId(res.data.workspace.chats[0]._id); // default first chat
        }
      } catch (err) {
        console.error("Failed to fetch workspace data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  if (loading) return <div className="text-gray-400 p-4">Loading workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Left Sidebar: Workspace Info + Tabs + Chat List */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">{workspace?.name || "Workspace"}</h2>

        {/* Tabs */}
        <div className="space-y-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition 
                ${activeTab === tab.id ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-indigo-300 font-semibold mb-2">Chats</h3>
          {chats.length === 0 ? (
            <p className="text-gray-400 text-sm">No chats yet.</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => { setActiveTab("chat"); setActiveChatId(chat._id); }}
                className={`flex items-center w-full px-3 py-2 rounded-lg mb-2 text-left text-sm transition 
                  ${activeChatId === chat._id ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                {chat.name || "Unnamed Chat"}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Workspace Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm">Total Members</p>
                <h2 className="text-2xl font-semibold text-indigo-300">
                  {workspace?.members?.length || 0}
                </h2>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm">Total Chats</p>
                <h2 className="text-2xl font-semibold text-indigo-300">
                  {workspace?.chats?.length || 0}
                </h2>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm">Tasks</p>
                <h2 className="text-2xl font-semibold text-indigo-300">
                  {workspace?.stats?.totalTasks || 0}
                </h2>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm">Files</p>
                <h2 className="text-2xl font-semibold text-indigo-300">
                  {workspace?.stats?.filesUploaded || 0}
                </h2>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && activeChatId && (
          <div className="h-full">
            <ChatSection
              workspaceId={workspaceId}
              chatId={activeChatId}
              currentUser={userId}
            />
          </div>
        )}

        {activeTab === "tasks" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Task Board</h1>
            <p className="text-gray-400">Kanban board will be here.</p>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Notes</h1>
            <p className="text-gray-400">Notes editor goes here.</p>
          </div>
        )}

        {activeTab === "files" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Files</h1>
            <p className="text-gray-400">File manager and uploads here.</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Activity Feed</h1>
            <p className="text-gray-400">Real-time events will show here.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar: Members Online */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4 text-indigo-300">Members Online</h3>
        <div className="space-y-3 text-gray-400">
          {workspace?.members?.map((m) => (
            <p key={m._id}>• {m.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
