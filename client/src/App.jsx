import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Schemes from "./pages/Schemes.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SchemesForm from "./pages/SchemesForm.jsx";
import "./style.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "1.5rem" }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public access to schemes and scholarships listing */}
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/scholarships" element={<Scholarships />} />

          {/* Protected management routes */}
          <Route
            path="/schemes/add"
            element={
              <ProtectedRoute govOrAdminOnly>
                <SchemesForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships/add"
            element={
              <ProtectedRoute govOrAdminOnly>
                {/* ScholarshipForm if separate */}
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
