import React, { useState } from "react";
import { api } from "../utils/api";

const ScholarshipForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    department: "",
    eligibility: "",
    applicationDeadline: "",
    description: "",
    amount: "",
    status: "open",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.applicationDeadline) newErrors.applicationDeadline = "Application deadline is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = "Valid amount is required";
    if (!form.eligibility.trim()) newErrors.eligibility = "Eligibility is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title,
      department: form.department,
      eligibility: form.eligibility,
      applicationDeadline: form.applicationDeadline,
      description: form.description,
      amount: Number(form.amount),
      status: form.status,
    };

    const { res, data } = await api("/api/scholarships", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert(data?.message || "❌ Failed to add scholarship (must be Gov/Admin)");
      return;
    }

    alert("✅ Scholarship added successfully!");
    if (onSuccess) onSuccess();

    setForm({
      title: "",
      department: "",
      eligibility: "",
      applicationDeadline: "",
      description: "",
      amount: "",
      status: "open",
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Scholarship</h2>
      <form onSubmit={handleSubmit} className="scholarship-form">
        <section>
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <p className="error-text">{errors.title}</p>}

          <label>Department *</label>
          <input name="department" value={form.department} onChange={handleChange} />
          {errors.department && <p className="error-text">{errors.department}</p>}

          <label>Eligibility *</label>
          <input name="eligibility" value={form.eligibility} onChange={handleChange} />
          {errors.eligibility && <p className="error-text">{errors.eligibility}</p>}

          <label>Application Deadline *</label>
          <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} />
          {errors.applicationDeadline && <p className="error-text">{errors.applicationDeadline}</p>}

          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
          {errors.description && <p className="error-text">{errors.description}</p>}

          <label>Amount *</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} step="0.01" />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </section>

        <button className="btn-submit" type="submit">Save Scholarship</button>
      </form>
    </div>
  );
};

export default ScholarshipForm;
