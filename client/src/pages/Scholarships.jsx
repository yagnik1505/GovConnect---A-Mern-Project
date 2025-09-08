import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import ScholarshipForm from "./ScholarshipForm";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [applyingFor, setApplyingFor] = useState(null);
  const [applicationData, setApplicationData] = useState({ name: "", email: "" });
  const [appSubmitting, setAppSubmitting] = useState(false);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    const { data } = await api("/api/scholarships");
    setScholarships(Array.isArray(data) ? data : data?.scholarships || []);
  };

  const handleApplyChange = (e) => {
    setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applicationData.name || !applicationData.email) {
      alert("Please fill all required fields");
      return;
    }
    setAppSubmitting(true);
    try {
      const { res, data } = await api("/api/apply", {
        method: "POST",
        body: JSON.stringify({
          itemId: applyingFor._id,
          itemType: "scholarship",
          name: applicationData.name,
          email: applicationData.email,
          title: applyingFor.title,
        }),
      });
      if (res.ok) {
        alert("Application submitted successfully!");
        setApplyingFor(null);
        setApplicationData({ name: "", email: "" });
      } else {
        alert(data?.message || "Failed to submit application.");
      }
    } catch {
      alert("Error submitting application.");
    } finally {
      setAppSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: "2rem 0", width: "100%" }}>
      <h1 className="page-title" style={{ textAlign: "left", marginLeft: "3rem", marginBottom: "2rem" }}>
        Scholarships
      </h1>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <button
          className="add-btn"
          style={{ width: "100%", borderRadius: "1.3rem", fontSize: "1.4rem", marginBottom: "2.5rem" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "➕ Add Scholarship"}
        </button>

        {showForm && (
          <ScholarshipForm
            onSuccess={() => {
              setShowForm(false);
              loadScholarships();
            }}
          />
        )}

        <div className="scholarships-wide-container">
          {scholarships.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
              No scholarships available at the moment.
            </p>
          )}
          {scholarships.map((s) => (
            <div className="scholarship-card" key={s._id}>
              <h3>{s.title}</h3>
              <div className="scholarship-details">
                <div>
                  <span className="label">Department:</span> {s.department}
                </div>
                <div>
                  <span className="label">Eligibility:</span> {s.eligibility}
                </div>
                <div>
                  <span className="label">Application Deadline:</span> {new Date(s.applicationDeadline).toLocaleDateString()}
                </div>
                <div>
                  <span className="label">Description:</span> {s.description}
                </div>
                <div>
                  <span className="label">Amount:</span> ${s.amount}
                </div>
                <div>
                  <span className="label">Status:</span> {s.status}
                </div>
              </div>
              <button
                type="button"
                className="apply-btn"
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.8rem",
                  border: "none",
                  background: "#3b82f6",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
                onClick={() => setApplyingFor(s)}
              >
                Apply Now
              </button>

              {applyingFor && applyingFor._id === s._id && (
                <form onSubmit={submitApplication} style={{ marginTop: "1rem" }}>
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
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    disabled={appSubmitting}
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
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    disabled={appSubmitting}
                  />
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    <button
                      type="submit"
                      disabled={appSubmitting}
                      style={{
                        flexGrow: 1,
                        padding: "0.6rem",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {appSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyingFor(null)}
                      disabled={appSubmitting}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
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
