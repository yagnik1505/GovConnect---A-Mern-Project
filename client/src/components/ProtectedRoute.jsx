import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user.designation !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
