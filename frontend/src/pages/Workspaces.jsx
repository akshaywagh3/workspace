import React, { useState, useEffect } from "react";
import WorkspaceAPI from "../api/workspaceApi"; // adjust path as needed

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const workspaceApi = new WorkspaceAPI(); // instance of your API class

  // 🔹 Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await workspaceApi.getMyWorkspaces();
      setWorkspaces(res.workspaces || []);
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    }
  };

  const createWorkspace = async () => {
    if (!workspaceName.trim()) return;

    try {
      await workspaceApi.createWorkspace(workspaceName);
      setShowModal(false);
      setWorkspaceName("");
      fetchWorkspaces(); // reload after create
    } catch (err) {
      console.error("Failed to create workspace", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
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
