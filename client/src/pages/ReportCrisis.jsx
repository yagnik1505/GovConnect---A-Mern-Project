import React, { useState } from "react";
import { api } from "../utils/api";

export default function ReportCrisis() {
  const [crisisForm, setCrisisForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "other",
    priority: "medium",
    ward: "",
    contact: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submitCrisis = async (e) => {
    e.preventDefault();
    if (!crisisForm.title.trim() || !crisisForm.description.trim()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(crisisForm).forEach(([k, v]) => fd.append(k, v));
      if (proofFile) fd.append("proof", proofFile);
      const { res, data } = await api("/api/crises", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        alert("Crisis submitted successfully");
        setCrisisForm({ title: "", description: "", location: "", category: "other", priority: "medium", ward: "", contact: "" });
        setProofFile(null);
      } else {
        alert(data?.message || "Failed to submit crisis");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "1rem" }}>
      <h1 className="text-3xl font-bold mb-6">Report a Crisis</h1>
      <p className="text-gray-600" style={{ marginBottom: "1rem" }}>Let the government know about an issue in your area.</p>

      <form onSubmit={submitCrisis}>
        <div className="grid-2">
          <div>
            <label>Title</label>
            <input
              value={crisisForm.title}
              onChange={(e) => setCrisisForm({ ...crisisForm, title: e.target.value })}
              placeholder="e.g. Water shortage in Ward 12"
              className="input"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
              required
            />
          </div>
          <div>
            <label>Location</label>
            <input
              value={crisisForm.location}
              onChange={(e) => setCrisisForm({ ...crisisForm, location: e.target.value })}
              placeholder="e.g. Near City Hospital"
              className="input"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={crisisForm.category}
              onChange={(e) => setCrisisForm({ ...crisisForm, category: e.target.value })}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="health">Health</option>
              <option value="safety">Safety</option>
              <option value="environment">Environment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select
              value={crisisForm.priority}
              onChange={(e) => setCrisisForm({ ...crisisForm, priority: e.target.value })}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Ward</label>
            <input
              value={crisisForm.ward}
              onChange={(e) => setCrisisForm({ ...crisisForm, ward: e.target.value })}
              placeholder="e.g. Ward 12"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
            />
          </div>
          <div>
            <label>Contact</label>
            <input
              value={crisisForm.contact}
              onChange={(e) => setCrisisForm({ ...crisisForm, contact: e.target.value })}
              placeholder="Your phone or email"
              style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}
            />
          </div>
          <div>
            <label>Photo Proof (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
          </div>
        </div>
        <div style={{ marginTop: "0.8rem" }}>
          <label>Description</label>
          <textarea
            value={crisisForm.description}
            onChange={(e) => setCrisisForm({ ...crisisForm, description: e.target.value })}
            placeholder="Describe the issue and its impact"
            style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", minHeight: 80 }}
            required
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: "0.8rem" }}>
          {submitting ? "Submitting..." : "Submit Crisis"}
        </button>
      </form>
    </div>
  );
}
