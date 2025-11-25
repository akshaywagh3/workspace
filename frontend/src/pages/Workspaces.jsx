import React, { useState, useEffect } from "react";
import WorkspaceAPI from "../api/workspaceApi";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Workspaces() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    totalMembers: 0,
    totalTasks: 0,
    filesUploaded: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [members, setMembers] = useState([]);
  const workspaceApi = new WorkspaceAPI();

  useEffect(() => {
    fetchWorkspaces();
    fetchOverviewData();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await workspaceApi.getMyWorkspaces();
      setWorkspaces(res.workspaces || []);
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    }
  };

  const fetchOverviewData = async () => {
    try {
      const overview = await workspaceApi.getDashboardOverview();
      setStats(overview.stats || stats);
      setRecentActivity(overview.recentActivity || []);
      setMembers(overview.members || []);
    } catch (err) {
      console.error("Failed to fetch overview", err);
    }
  };

  const createWorkspace = async () => {
    if (!workspaceName.trim()) return;
    try {
      await workspaceApi.createWorkspace(workspaceName);
      setShowModal(false);
      setWorkspaceName("");
      fetchWorkspaces();
    } catch (err) {
      console.error("Failed to create workspace", err);
    }
  };

  const formatTime = (timeStr) => {
    const d = new Date(timeStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isYesterday =
      d.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
    return isToday
      ? `Today, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : isYesterday
      ? `Yesterday, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Workspaces</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg font-medium mb-4"
        >
          <PlusIcon className="w-5 h-5" /> Create Workspace
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {workspaces.map((ws) => (
            <div
              key={ws._id}
              onClick={() => navigate(`/workspace/${ws._id}`)}
              className="p-3 rounded-lg hover:bg-indigo-600 hover:text-white cursor-pointer transition flex justify-between items-center"
            >
              <span>{ws.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(ws.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <h2 className="text-2xl font-semibold text-indigo-300">{value}</h2>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          {["Create Task", "Add Note", "Upload File", "Invite Member"].map((action) => (
            <button
              key={action}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500">No recent activity</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((act, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex justify-between">
                  <span>• {act.message}</span>
                  <span className="text-gray-500">{formatTime(act.time)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Members */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Members</h2>
          <div className="flex gap-4 flex-wrap">
            {members.map((m) => (
              <div
                key={m._id}
                className="bg-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600 cursor-pointer transition"
              >
                <img
                  src={m.avatar || "/avatar.png"}
                  alt={m.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-[90%] max-w-md shadow-lg border border-gray-800">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-400">
              Create Workspace
            </h3>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createWorkspace}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
