import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">GovConnect</div>
      <div className="nav-links">
        <Link to="/schemes">Schemes</Link>
        <Link to="/scholarships">Scholarships</Link>

        {/* Show Dashboard links based on role */}
        {isAuthed && user.designation === "admin" ? (
          <Link to="/admin/dashboard">Admin</Link>
        ) : (
          <Link to="/dashboard">Dashboard</Link>
        )}

        {!isAuthed ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
