import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Workspace from "../api/workspaceApi.js";

export default function JoinWorkspace() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Joining workspace...");

  useEffect(() => {
    async function join() {
      try {
        const res = await Workspace.joinByToken(token);
        setStatus("✅ Joined workspace successfully!");
        setTimeout(() => navigate("/workspaces"), 1500);
      } catch (err) {
        console.error(err);
        setStatus("❌ Invalid or expired invite link");
      }
    }
    join();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-2">{status}</h2>
        {status.includes("✅") && (
          <p className="text-sm text-gray-500">Redirecting to workspaces...</p>
        )}
      </div>
    </div>
  );
}
