import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, BASE_URL } from "../utils/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = (user.designation || "").toLowerCase() === "admin";
  const isGovEmployee = (user.userType || "").toLowerCase() === "government" && !isAdmin;
  const navigate = useNavigate();

  const [crises, setCrises] = useState([]);
  const [loadingCrises, setLoadingCrises] = useState(false);
  const [myCrises, setMyCrises] = useState([]);
  const [loadingMyCrises, setLoadingMyCrises] = useState(false);
  const [crisisForm, setCrisisForm] = useState({ title: "", description: "", location: "", category: "other", priority: "medium", ward: "", contact: "" });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isGovEmployee) {
      loadCrises();
    } else {
      loadMyCrises();
    }
  }, [isGovEmployee]);

  const loadCrises = async () => {
    try {
      setLoadingCrises(true);
      const { res, data } = await api("/api/crises");
      if (res.ok) {
        setCrises(Array.isArray(data) ? data : data.crises || []);
      }
    } finally {
      setLoadingCrises(false);
    }
  };

  const loadMyCrises = async () => {
    try {
      setLoadingMyCrises(true);
      const { res, data } = await api("/api/crises/mine");
      if (res.ok) {
        setMyCrises(Array.isArray(data) ? data : data.crises || []);
      }
    } finally {
      setLoadingMyCrises(false);
    }
  };

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
        await loadMyCrises();
      } else {
        alert(data?.message || "Failed to submit crisis");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resolveWithProof = async (crisisId, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("proof", file);
    const { res, data } = await api(`/api/crises/${crisisId}/resolve`, { method: "POST", body: fd });
    if (res.ok) {
      await loadCrises();
    } else {
      alert(data?.message || "Failed to resolve");
    }
  };

  const statusBadgeClass = (status) => `badge badge-status-${status}`;
  const priorityBadgeClass = (priority) => `badge badge-priority-${priority}`;

  const renderProof = (c) => {
    const src = c.proofImageDataUrl || (c.proofImageUrl ? `${BASE_URL}${c.proofImageUrl}` : null);
    if (!src) return null;
    return (
      <div style={{ marginTop: "0.6rem" }}>
        <img src={src} alt="proof" className="img-thumb" />
      </div>
    );
  };

  const renderResolutionProof = (c) => {
    const src = c.resolutionProofDataUrl || (c.resolutionProofUrl ? `${BASE_URL}${c.resolutionProofUrl}` : null);
    if (!src) return null;
    return (
      <div style={{ marginTop: "0.6rem" }}>
        <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Resolution proof:</p>
        <img src={src} alt="resolution proof" className="img-thumb" />
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: "1rem" }}>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || "User"}!</h1>
      <p className="text-gray-600 mb-8">
        You are logged in as <strong>{(user.userType || "").toLowerCase()}</strong>
        {user.userType && ` (${(user.designation || "").toLowerCase()})`}
      </p>

      {/* Public users: Crisis submission */}
      {((user.userType || "").toLowerCase() !== "government") && (
        <div className="panel panel-public" style={{ marginBottom: "2rem" }}>
          <h2 className="text-xl font-semibold mb-2">Report a Crisis</h2>
          <p className="text-gray-600" style={{ marginBottom: "1rem" }}>Let the government know about an issue in your area.</p>
          <form onSubmit={submitCrisis}>
            <div className="grid-2">
              <div>
                <label>Title</label>
                <input value={crisisForm.title} onChange={(e) => setCrisisForm({ ...crisisForm, title: e.target.value })} placeholder="e.g. Water shortage in Ward 12" className="input" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }} required />
              </div>
              <div>
                <label>Location</label>
                <input value={crisisForm.location} onChange={(e) => setCrisisForm({ ...crisisForm, location: e.target.value })} placeholder="e.g. Near City Hospital" className="input" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label>Category</label>
                <select value={crisisForm.category} onChange={(e) => setCrisisForm({ ...crisisForm, category: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="health">Health</option>
                  <option value="safety">Safety</option>
                  <option value="environment">Environment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={crisisForm.priority} onChange={(e) => setCrisisForm({ ...crisisForm, priority: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label>Ward</label>
                <input value={crisisForm.ward} onChange={(e) => setCrisisForm({ ...crisisForm, ward: e.target.value })} placeholder="e.g. Ward 12" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label>Contact</label>
                <input value={crisisForm.contact} onChange={(e) => setCrisisForm({ ...crisisForm, contact: e.target.value })} placeholder="Your phone or email" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label>Photo Proof (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <div style={{ marginTop: "0.8rem" }}>
              <label>Description</label>
              <textarea value={crisisForm.description} onChange={(e) => setCrisisForm({ ...crisisForm, description: e.target.value })} placeholder="Describe the issue and its impact" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", minHeight: 80 }} required />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: "0.8rem" }}>
              {submitting ? "Submitting..." : "Submit Crisis"}
            </button>
          </form>
        </div>
      )}

      {/* Public users: My Reports */}
      {((user.userType || "").toLowerCase() !== "government") && (
        <div className="panel panel-public" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 className="text-xl font-semibold">My Reports</h2>
            <button type="button" onClick={loadMyCrises} className="admin-btn">Refresh</button>
          </div>
          {loadingMyCrises ? (
            <p>Loading...</p>
          ) : myCrises.length === 0 ? (
            <p>You have not submitted any reports yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {myCrises.map((c) => (
                <div key={c._id} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.1rem" }}>{c.title}</h3>
                    <span style={{ fontSize: "0.9rem", color: "#334155" }}>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ marginTop: "0.3rem" }}>{c.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span className={statusBadgeClass(c.status)}>{c.status}</span>
                    <span className={priorityBadgeClass(c.priority || "medium")}>{c.priority || "medium"}</span>
                    {c.category && <span className="badge">{c.category}</span>}
                    {c.ward && <span className="badge">{c.ward}</span>}
                  </div>
                  {c.location && <p style={{ color: "#475569", marginTop: "0.3rem" }}>Location: {c.location}</p>}
                  {c.contact && <p style={{ color: "#475569", marginTop: "0.3rem" }}>Contact: {c.contact}</p>}
                  {c.proofImageDataUrl || c.proofImageUrl ? (
                    <div style={{ marginTop: "0.6rem" }}>
                      <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Your submitted proof:</p>
                      {renderProof(c)}
                    </div>
                  ) : null}
                  {c.status === "completed" && (c.resolutionProofDataUrl || c.resolutionProofUrl) && (
                    <div style={{ marginTop: "0.6rem" }}>
                      <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Government resolution proof:</p>
                      {renderResolutionProof(c)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Government employees (not admin): Crisis list */}
      {isGovEmployee && (
        <div className="panel panel-government" style={{ paddingTop: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 className="text-xl font-semibold">Reported Crises</h2>
            <button type="button" onClick={loadCrises} className="admin-btn">Refresh</button>
          </div>
          {loadingCrises ? (
            <p>Loading...</p>
          ) : crises.length === 0 ? (
            <p>No crises reported yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {crises.map((c) => (
                <div key={c._id} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.1rem" }}>{c.title}</h3>
                    <span style={{ fontSize: "0.9rem", color: "#334155" }}>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ marginTop: "0.3rem" }}>{c.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span className={statusBadgeClass(c.status)}>{c.status}</span>
                    <span className={priorityBadgeClass(c.priority || "medium")}>{c.priority || "medium"}</span>
                    {c.category && <span className="badge">{c.category}</span>}
                    {c.ward && <span className="badge">{c.ward}</span>}
                  </div>
                  {c.location && <p style={{ color: "#475569", marginTop: "0.3rem" }}>Location: {c.location}</p>}
                  {c.contact && <p style={{ color: "#475569", marginTop: "0.3rem" }}>Contact: {c.contact}</p>}
                  {renderProof(c)}
                  {c.createdBy && (
                    <p style={{ color: "#475569", marginTop: "0.3rem" }}>Reported by: <strong>{c.createdBy.name}</strong>{c.createdBy.email ? ` (${c.createdBy.email})` : ""}</p>
                  )}

                  {c.status !== "completed" && (
                    <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                      <label style={{ fontWeight: 600 }}>Resolve with proof:</label>
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && resolveWithProof(c._id, e.target.files[0])} />
                    </div>
                  )}

                  {c.status === "completed" && (c.resolutionProofDataUrl || c.resolutionProofUrl) && (
                    <div style={{ marginTop: "0.6rem" }}>
                      {renderResolutionProof(c)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
