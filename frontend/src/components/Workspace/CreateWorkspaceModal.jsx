import React, { useState } from "react";
import { createWorkspace } from "../../api/workspaceApi";

export default function CreateWorkspaceModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Workspace name is required");
    setLoading(true);
    try {
      await createWorkspace(name);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Create Workspace</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter workspace name"
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
