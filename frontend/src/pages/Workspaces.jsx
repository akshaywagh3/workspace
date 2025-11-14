import React, { useState, useEffect } from "react";
import WorkspaceAPI from "../api/workspaceApi";
import { useNavigate } from "react-router-dom";

export default function Workspaces() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  // NEW DATA FOR OVERVIEW
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
      // Call to new backend endpoints (placeholder example)
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Workspaces</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-medium shadow-md transition"
          >
            <span className="text-lg">+</span> Create Workspace
          </button>
        </div>

        {/* OVERVIEW SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Workspaces</p>
            <h2 className="text-2xl font-semibold text-indigo-300">
              {stats.totalWorkspaces}
            </h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Members</p>
            <h2 className="text-2xl font-semibold text-indigo-300">
              {stats.totalMembers}
            </h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Tasks Created</p>
            <h2 className="text-2xl font-semibold text-indigo-300">
              {stats.totalTasks}
            </h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Files Uploaded</p>
            <h2 className="text-2xl font-semibold text-indigo-300">
              {stats.filesUploaded}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-10">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            📄 Create Task
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            📝 Add Note
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            📤 Upload File
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            ➕ Invite Member
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((act, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  • {act.message}{" "}
                  <span className="text-gray-500">({act.time})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Members Preview */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Members
          </h2>

          <div className="flex gap-4 flex-wrap">
            {members.map((m) => (
              <div
                key={m._id}
                className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <img
                  src={m.avatar || "/avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <p>{m.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace List */}
        {workspaces.length === 0 ? (
          <div className="text-gray-400 text-center mt-16">
            <p className="text-lg">You don’t have any workspaces yet.</p>
            <p className="mt-2">
              Click{" "}
              <span className="font-semibold text-indigo-400">
                “Create Workspace”
              </span>{" "}
              to start collaborating!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {workspaces.map((ws) => (
              <div
                key={ws._id}
                onClick={() => navigate(`/workspace/${ws._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow hover:shadow-indigo-500/20 hover:border-indigo-500 transition cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-2 text-indigo-300">
                  {ws.name}
                </h2>
                <p className="text-sm text-gray-400">
                  Created on{" "}
                  {new Date(ws.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
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
