import axios from "axios";

const API_BASE = import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/auth"; 

class AuthAPI {
  constructor() {
    this.token = localStorage.getItem("token") ?? "";
    this.client = axios.create({
      baseURL: API_BASE,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

   async LoginAccount(email, password) {
    try {
      const response = await this.client.post("/login", { email, password });
      return {
        success: true,
        status: response.status,
        message: response.data.message,
        token: response.data.token,
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  }

  async RegisterAccount(email, password, firstname, lastname) {
    try {
      const res = await axios.post(`${API_BASE}/register`, {
        email,
        password,
        firstname,
        lastname,
      });
      return res; 
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return err.response?.data || { success: false, message: "Server error" };
    }
  }
}

export default new AuthAPI();
