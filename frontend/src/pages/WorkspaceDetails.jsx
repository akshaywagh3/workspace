import React, { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ClockIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function WorkspaceDetails() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: HomeIcon },
    { id: "chat", label: "Chat", icon: ChatBubbleLeftRightIcon },
    { id: "tasks", label: "Tasks", icon: RectangleStackIcon },
    { id: "notes", label: "Notes", icon: DocumentTextIcon },
    { id: "files", label: "Files", icon: FolderOpenIcon },
    { id: "activity", label: "Activity", icon: ClockIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-5">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Workspace</h2>

        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition 
                ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Workspace Overview</h1>

            {/* Summary Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <SummaryCard label="Tasks" value={stats.totalTasks} />
                <SummaryCard label="Notes" value={stats.totalNotes} />
                <SummaryCard label="Files" value={stats.totalFiles} />
                <SummaryCard label="Members" value={stats.totalMembers} />
            </div> */}

            {/* Recent Activity */}
            {/* <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 mb-8">
                <h2 className="text-xl font-semibold mb-3 text-indigo-300">Recent Activity</h2>
                {activity.length === 0 ? (
                <p className="text-gray-500">No recent actions yet.</p>
                ) : (
                <ul className="space-y-2">
                    {activity.slice(0, 6).map((act, i) => (
                    <li key={i} className="text-gray-300 text-sm">
                        • {act.message} <span className="text-gray-500">({act.timeAgo})</span>
                    </li>
                    ))}
                </ul>
                )}
            </div> */}

            {/* Members */}
            {/* <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 mb-8">
                <h2 className="text-xl font-semibold mb-3 text-indigo-300">Members</h2>
                <div className="flex gap-4 flex-wrap">
                {members.map((m) => (
                    <div key={m._id} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                    <img src={m.avatar} className="w-8 h-8 rounded-full" />
                    <p>{m.name}</p>
                    </div>
                ))}
                </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="flex gap-4">
                <Button>+ New Task</Button>
                <Button>+ Add Note</Button>
                <Button>+ Upload File</Button>
                <Button>Invite Member</Button>
            </div> */}
           </div>

        )}

        {activeTab === "chat" && (
          <div className="h-full">
            <h1 className="text-3xl font-bold mb-4">Chat</h1>
            <div className="bg-gray-900 border border-gray-800 rounded-xl h-[70vh] p-4">
              <p className="text-gray-400">Chat UI goes here...</p>
            </div>
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

      {/* Right Sidebar */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4 text-indigo-300">
          Members Online
        </h3>
        <div className="space-y-3 text-gray-400">
          <p>• John Doe</p>
          <p>• Alex</p>
          <p>• Sarah</p>
        </div>
      </div>
    </div>
  );
}
