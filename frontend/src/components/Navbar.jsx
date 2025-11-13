import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#f4f4f4" }}>
      {!isLoggedIn && (
        <>
          <Link to="/" style={{ margin: "0 10px" }}>Login</Link>
          <Link to="/register" style={{ margin: "0 10px" }}>Register</Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <Link to="/dashboard" style={{ margin: "0 10px" }}>Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
