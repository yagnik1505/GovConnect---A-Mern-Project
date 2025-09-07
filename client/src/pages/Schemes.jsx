import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import SchemesForm from "./SchemesForm";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    const { data } = await api("/api/schemes");
    setSchemes(Array.isArray(data) ? data : data?.schemes || []);
  };

  return (
    <div className="page-container" style={{ padding: "2rem 0", width: "100%" }}>
      <h1 className="page-title" style={{ textAlign: "left", marginLeft: "3rem", marginBottom: "2rem" }}>Schemes</h1>

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
          {showForm ? "Cancel" : "➕ Add Scheme"}
        </button>

        {showForm && (
          <SchemesForm
            onSuccess={() => {
              setShowForm(false);
              loadSchemes();
            }}
          />
        )}

        <div className="schemes-wide-container">
          {schemes.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>No schemes available at the moment.</p>
          )}
          {schemes.map((s) => (
            <div className="scheme-card" key={s._id}>
              <h3>{s.title}</h3>
              <div className="scheme-details">
                <div><span className="label">Department:</span> {s.department}</div>
                <div><span className="label">Launch Date:</span> {new Date(s.launchDate).toLocaleDateString()}</div>
                <div><span className="label">Description:</span> {s.description}</div>
                <div><span className="label">Status:</span> {s.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
