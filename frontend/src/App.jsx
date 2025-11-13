import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Whiteboard from "./pages/Whiteboard";  // ✅ Import Whiteboard
import ProtectedRoute from "./components/ProtectedRoute";
import WorkspaceDashboard from "./pages/Workspaces";
import JoinWorkspace from "./pages/JoinWorkspace";
import LandingPage from "./pages/LandingPage";

import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whiteboard"
          element={
            <ProtectedRoute>
              <Whiteboard />
            </ProtectedRoute>
          }
        />
        <Route path="/workspaces" element={<ProtectedRoute><WorkspaceDashboard /></ProtectedRoute>} />
        <Route path="/join/:token" element={<ProtectedRoute><JoinWorkspace /></ProtectedRoute>} />
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </Router>
  );
}

export default App;
