import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

const SchemesForm = ({ scheme, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    department: "",
    launchDate: "",
    description: "",
    status: "active",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (scheme) {
      setForm({
        title: scheme.title || "",
        department: scheme.department || "",
        launchDate: scheme.launchDate ? scheme.launchDate.split("T")[0] : "",
        description: scheme.description || "",
        status: scheme.status || "active",
      });
    }
  }, [scheme]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    let url = "/api/schemes";
    let method = "POST";
    if (scheme && scheme._id) {
      url = `/api/schemes/${scheme._id}`;
      method = "PUT";
    }

    const { res, data } = await api(url, { method, body: JSON.stringify(payload) });

    if (!res.ok) {
      alert(data?.message || `Failed to ${scheme ? "update" : "add"} scheme (must be Gov/Admin)`);
      return;
    }

    alert(`✅ Scheme ${scheme ? "updated" : "added"} successfully!`);
    if (onSuccess) onSuccess();

    // Redirect to listing
    navigate("/schemes", { replace: true });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{scheme ? "Update Scheme" : "Add Scheme"}</h2>
      <form onSubmit={handleSubmit} className="scheme-form">
        <section>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Department</label>
          <input name="department" value={form.department} onChange={handleChange} required />

          <label>Launch Date</label>
          <input type="date" name="launchDate" value={form.launchDate} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />

          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>

        <button className="btn-submit" type="submit">{scheme ? "Update" : "Save"} Scheme</button>

        {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  marginTop: "1rem",
                  // marginLeft: "1rem",
                  padding: "0.6rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  padding: "0.8rem 1.5rem",  
                }}
              >
                Cancel
              </button>
        )}
      </form>
    </div>
  );
};

export default SchemesForm;
