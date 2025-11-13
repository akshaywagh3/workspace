import React, { useEffect, useState } from "react";
import { getMyWorkspaces, deleteWorkspace, getInviteLink } from "../../api/workspaceApi";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import AddMemberModal from "./AddMemberModal";
import { Link } from "react-router-dom";
import { Users, Share2, Trash2, Plus } from "lucide-react";

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const res = await getMyWorkspaces();
      setWorkspaces(res.data.workspaces);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetInvite = async (id) => {
    try {
      const res = await getInviteLink(id);
      setInviteLink(res.data.link);
      navigator.clipboard.writeText(res.data.link);
      alert("Invite link copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to get invite link");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workspace?")) {
      await deleteWorkspace(id);
      loadWorkspaces();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Workspaces</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Create Workspace
          </button>
        </div>

        {/* Workspace Cards */}
        {workspaces.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>No workspaces yet.</p>
            <p>Click <strong>“Create Workspace”</strong> to start collaborating!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <div
                key={ws._id}
                className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{ws.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {ws.members?.length || 0} members
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-auto">
                  <button
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setShowAddMemberModal(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Users size={16} /> Add
                  </button>
                  <button
                    onClick={() => handleGetInvite(ws._id)}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Share2 size={16} /> Invite
                  </button>
                  <button
                    onClick={() => handleDelete(ws._id)}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadWorkspaces}
        />
      )}
      {showAddMemberModal && selectedWorkspace && (
        <AddMemberModal
          workspace={selectedWorkspace}
          onClose={() => setShowAddMemberModal(false)}
        />
      )}
    </div>
  );
}
