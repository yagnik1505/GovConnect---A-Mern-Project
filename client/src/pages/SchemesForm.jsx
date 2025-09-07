import React, { useState } from "react";
import { api } from "../utils/api";

const SchemesForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    launchDate: "",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      department: form.department,
      launchDate: form.launchDate,
      description: form.description,
      status: form.status,
    };

    const { res, data } = await api("/api/schemes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert(data?.message || "❌ Failed to add scheme (must be Gov/Admin)");
      return;
    }

    alert("✅ Scheme added successfully!");
    if (onSuccess) onSuccess();

    setForm({
      title: "",
      description: "",
      department: "",
      launchDate: "",
      status: "active",
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Scheme</h2>
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

        <button className="btn-submit" type="submit">Save Scheme</button>
      </form>
    </div>
  );
};

export default SchemesForm;
