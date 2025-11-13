import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthAPI from "../api/authapi.js"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await AuthAPI.LoginAccount(email, password);

      if (response?.success) {
        localStorage.setItem("token", response.token);

        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userid", response.id);

        navigate("/dashboard");
      } else {
        setErrorMsg(response?.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your workspace"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Login
        </button>
      </form>

      <p className="text-gray-400 text-center mt-6 text-sm">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Register here
        </a>
      </p>
    </AuthLayout>
  );
}
