import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import SchemesForm from "./SchemesForm";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [applyingFor, setApplyingFor] = useState(null);
  const [applicationData, setApplicationData] = useState({ name: "", email: "" });
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadSchemes();
    getUserRole();
  }, []);

  const loadSchemes = async () => {
    const { data } = await api("/api/schemes");
    setSchemes(Array.isArray(data) ? data : data?.schemes || []);
  };

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (token && storedUser) {
        setIsLoggedIn(true);
        setCurrentUser(storedUser);
        setApplicationData({ name: storedUser.name || "", email: storedUser.email || "" });
        
        const userType = storedUser?.userType?.toLowerCase().trim() || "public";
        const designation = storedUser?.designation?.toLowerCase().trim() || "user";

        let role = "public";
        if (userType === "government") {
          role = designation === "admin" ? "admin" : "government";
        }
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserRole("public");
      }
    } catch {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserRole("public");
    }
  };

  const handleApplyChange = (e) => {
    setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      alert("Please login to apply for schemes");
      return;
    }
    
    if (!applicationData.name || !applicationData.email) {
      alert("Please fill all required fields");
      return;
    }
    
    // Validate that the user is applying with their own credentials
    if (currentUser && (applicationData.name !== currentUser.name || applicationData.email !== currentUser.email)) {
      alert("You can only apply using your own name and email. Please use your registered credentials.");
      return;
    }
    
    setAppSubmitting(true);
    try {
      const { res, data } = await api("/api/apply", {
        method: "POST",
        body: JSON.stringify({
          itemId: applyingFor._id,
          itemType: "scheme",
          name: applicationData.name,
          email: applicationData.email,
          title: applyingFor.title,
        }),
      });
      if (res.ok) {
        alert("Application submitted successfully!");
        setApplyingFor(null);
        setApplicationData({ name: currentUser?.name || "", email: currentUser?.email || "" });
        loadSchemes(); // Reload schemes to update applicant count
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch {
      alert("Error submitting application");
    }
    setAppSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      const { res, data } = await api(`/api/schemes/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Deleted successfully");
        loadSchemes();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch {
      alert("Error deleting");
    }
  };

  const handleEditClick = (scheme) => {
    setEditingScheme(scheme);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setEditingScheme(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setEditingScheme(null);
    setShowForm(false);
    loadSchemes();
  };

  const isAdmin = userRole === "admin";
  const isGov = userRole === "government";

  return (
    <div className="page-container" style={{ padding: "2rem 0", width: "100%" }}>
      <h1 className="page-title" style={{ textAlign: "left", marginLeft: "3rem", marginBottom: "2rem" }}>
        Schemes
      </h1>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {(userRole === "admin" || userRole === "government") && (
          <button
            className="add-btn"
            style={{ width: "100%", borderRadius: "1.3rem", fontSize: "1.4rem", marginBottom: "2rem" }}
            onClick={() => {
              setEditingScheme(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "➕ Add Scheme"}
          </button>
        )}

        {showForm && (
          <SchemesForm onCancel={handleFormCancel} onSuccess={handleFormSuccess} scheme={editingScheme} />
        )}

        <div className="schemes-wide-container">
          {schemes.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
              No schemes available at the moment.
            </p>
          )}
          {schemes.map((s) => (
            <div className="scheme-card" key={s._id}>
              <h3>{s.title}</h3>
              <div className="scheme-details">
                <div>
                  <span className="label">Department:</span> {s.department}
                </div>
                <div>
                  <span className="label">Launch Date:</span> {new Date(s.launchDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="label">Description:</span> {s.description}
                </div>
                <div>
                  <span className="label">Status:</span> {s.status}
                </div>
                {(isAdmin || isGov) && (
                  <div>
                    <span className="label">Applicants:</span> {s.applicantCount || 0}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="apply-btn"
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "1.3rem",
                    border: "none",
                    background: isLoggedIn ? "#3b82f6" : "#9ca3af",
                    color: "white",
                    cursor: isLoggedIn ? "pointer" : "not-allowed",
                    fontWeight: "600",
                    fontSize: "1rem",
                    flexGrow: 1,
                  }}
                  onClick={() => {
                    if (isLoggedIn) {
                      setApplyingFor(s);
                    } else {
                      alert("Please login to apply for schemes");
                    }
                  }}
                  disabled={!isLoggedIn}
                >
                  {isLoggedIn ? "Apply Now" : "Login to Apply"}
                </button>

                {(isAdmin || isGov) && (
                  <button
                    type="button"
                    style={{
                      borderRadius: "1.3rem",
                      border: "none",
                      background: "#fbbf24",
                      color: "#222",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      padding: "0.6rem 1.2rem",
                    }}
                    onClick={() => handleEditClick(s)}
                  >
                    Update
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    className="delete-btn"
                    style={{
                      borderRadius: "1.3rem",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      padding: "0.6rem 1.2rem",
                    }}
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                )}
              </div>

              {applyingFor && applyingFor._id === s._id && (
                <form onSubmit={submitApplication} style={{ marginTop: "1rem" }}>
                  <div style={{ marginBottom: "0.8rem", padding: "0.8rem", backgroundColor: "#f0f9ff", borderRadius: "0.5rem", border: "1px solid #0ea5e9" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#0369a1" }}>
                      <strong>Note:</strong> You are applying as <strong>{currentUser?.name}</strong> ({currentUser?.email}). 
                      You can only apply using your registered credentials.
                    </p>
                  </div>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={applicationData.name}
                    onChange={handleApplyChange}
                    required
                    style={{
                      padding: "0.6rem",
                      width: "100%",
                      marginBottom: "0.6rem",
                      borderRadius: "1.3rem",
                      border: "1px solid #ccc",
                      backgroundColor: "#f9fafb",
                    }}
                    disabled={appSubmitting}
                    readOnly
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={applicationData.email}
                    onChange={handleApplyChange}
                    required
                    style={{
                      padding: "0.6rem",
                      width: "100%",
                      marginBottom: "0.6rem",
                      borderRadius: "1.3rem",
                      border: "1px solid #ccc",
                      backgroundColor: "#f9fafb",
                    }}
                    disabled={appSubmitting}
                    readOnly
                  />
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    <button
                      type="submit"
                      disabled={appSubmitting}
                      style={{
                        flexGrow: 1,
                        backgroundColor: "#2563eb",
                        color: "white",
                        borderRadius: "1.3rem",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "1rem",
                        padding: "0.6rem",
                      }}
                    >
                      {appSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyingFor(null)}
                      disabled={appSubmitting}
                      style={{
                        flexGrow: 1,
                        backgroundColor: "#f3f4f6",
                        color: "#222",
                        borderRadius: "1.3rem",
                        border: "1px solid #ccc",
                        fontWeight: "600",
                        fontSize: "1rem",
                        padding: "0.6rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
