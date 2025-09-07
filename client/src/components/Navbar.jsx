import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.designation?.toLowerCase() === "admin";
  const isGov   = user?.userType?.toLowerCase() === "government";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <nav className="navbar">  
      <div className="logo">GovConnect</div>
      <div className="nav-links">
        <Link to="/" className={isActive("/") && location.pathname === "/" ? "active" : ""}>Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>Dashboard</Link>

            {(isGov || isAdmin) && (
              <>
                <Link to="/schemes" className={isActive("/schemes") ? "active" : ""}>Schemes</Link>
                <Link to="/scholarships" className={isActive("/scholarships") ? "active" : ""}>Scholarships</Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin/dashboard" className={isActive("/admin") ? "active" : ""}>Admin Panel</Link>
            )}

            <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login") ? "active" : ""}>Login</Link>
            <Link to="/signup" className={isActive("/signup") ? "active" : ""}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
