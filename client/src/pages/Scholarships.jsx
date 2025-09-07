import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import ScholarshipForm from "./ScholarshipForm";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    const { data } = await api("/api/scholarships");
    setScholarships(Array.isArray(data) ? data : data?.scholarships || []);
  };

  return (
    <div className="page-container" style={{ padding: "2rem 0", width: "100%" }}>
      <h1 className="page-title" style={{ textAlign: "left", marginLeft: "3rem", marginBottom: "2rem" }}>Scholarships</h1>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <button
          className="add-btn"
          style={{
            width: "100%",
            borderRadius: "1.3rem",
            fontSize: "1.4rem",
            marginBottom: "2.5rem",
          }}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
