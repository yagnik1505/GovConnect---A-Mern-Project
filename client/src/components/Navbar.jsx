import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.designation?.toLowerCase() === "admin";
  const isGov = user?.userType?.toLowerCase() === "government";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fixed isActive function to handle root path correctly
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Style for the active link box
  const activeBoxStyle = {
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    backgroundColor: "#3b82f6", // blue color
    color: "white",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  return (
    <nav className="navbar">
      <div className="logo">GovConnect</div>
      <div className="nav-links">
        <Link to="/" style={isActive("/") ? activeBoxStyle : undefined}>Home</Link>

        {/* Schemes and Scholarships are visible to everyone */}
        <Link
          to="/schemes"
          style={isActive("/schemes") ? activeBoxStyle : undefined}
        >
          Schemes
        </Link>
        <Link
          to="/scholarships"
          style={isActive("/scholarships") ? activeBoxStyle : undefined}
        >
          Scholarships
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" style={isActive("/dashboard") ? activeBoxStyle : undefined}>
              Dashboard
            </Link>

            {isAdmin && (
              <Link to="/admin/dashboard" style={isActive("/admin") ? activeBoxStyle : undefined}>
                Admin Panel
              </Link>
            )}

            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={isActive("/login") ? activeBoxStyle : undefined}>Login</Link>
            <Link to="/signup" style={isActive("/signup") ? activeBoxStyle : undefined}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
