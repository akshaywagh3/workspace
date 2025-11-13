import React, { useState } from "react";
import { addMember } from "../../api/workspaceApi";

export default function AddMemberModal({ workspace, onClose }) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId.trim()) return alert("User ID is required");
    setLoading(true);
    try {
      await addMember(workspace._id, userId);
      alert("Member added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">
          Add Member to "{workspace.name}"
        </h2>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID or email"
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
