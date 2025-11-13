import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default class WorkspaceAPI {
  constructor() {
    // Create an axios instance 
    this.api = axios.create({
      baseURL: API_BASE,
      withCredentials: true,
    });
  }

  // Dynamically get headers with the latest token
  getAuthHeaders() {
    const token = localStorage.getItem("token") ?? '';
    return { Authorization: `Bearer ${token}` };
  }

  async createWorkspace(name) {
    try {
      const res = await this.api.post("/workspace/create", { name }, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }

  async getMyWorkspaces() {
    try {
      const res = await this.api.get("/workspace/my", {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }

  async addMember(workspaceId, userId) {
    try {
      const res = await this.api.post("/workspace/add-member", { workspaceId, userId }, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }

  async deleteWorkspace(workspaceId) {
    try {
      const res = await this.api.delete(`/workspace/${workspaceId}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }

  async getInviteLink(workspaceId) {
    try {
      const res = await this.api.get(`/workspace/invite/${workspaceId}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }

  async joinByToken(token) {
    try {
      const res = await this.api.get(`/workspace/join/${token}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }
}
