import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  govOrAdminOnly = false,
}) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = (user.designation || "").toLowerCase() === "admin";
  const isGov = (user.userType || "").toLowerCase() === "government";

  // Admin-only routes → block non-admins
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Gov or Admin routes → block others
  if (govOrAdminOnly && !(isAdmin || isGov)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
