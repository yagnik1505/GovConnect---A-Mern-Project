import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome <strong>{user.name}</strong> (Admin)
      </p>

      <div className="grid-3">
        <div className="panel panel-admin">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-700">View and manage all registered users.</p>
        </div>
        <Link to="/schemes" className="panel panel-admin" style={{ textDecoration: "none" }}>
          <h2 className="text-xl font-semibold mb-2">Scheme Control</h2>
          <p className="text-gray-700">Go to Schemes to approve, edit, or remove.</p>
        </Link>
        <Link to="/report-crisis" className="panel panel-admin" style={{ textDecoration: "none" }}>
          <h2 className="text-xl font-semibold mb-2">Report a Crisis</h2>
          <p className="text-gray-700">Open the crisis reporting and review page.</p>
        </Link>
      </div>
    </div>
  );
}
