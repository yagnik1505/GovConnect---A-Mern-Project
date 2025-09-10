import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

const ScholarshipForm = ({ scholarship, onSuccess, onCancel }) => {
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

  useEffect(() => {
    if (scholarship) {
      setForm({
        title: scholarship.title || "",
        department: scholarship.department || "",
        eligibility: scholarship.eligibility || "",
        applicationDeadline: scholarship.applicationDeadline ? scholarship.applicationDeadline.split("T")[0] : "",
        description: scholarship.description || "",
        amount: scholarship.amount || "",
        status: scholarship.status || "open",
      });
      setErrors({});
    }
  }, [scholarship]);

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

    let url = "/api/scholarships";
    let method = "POST";
    if (scholarship && scholarship._id) {
      url = `/api/scholarships/${scholarship._id}`;
      method = "PUT";
    }

    const { res, data } = await api(url, {
      method,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert(data?.message || `Failed to ${scholarship ? "update" : "add"} scholarship (must be Gov/Admin)`);
      return;
    }

    alert(`✅ Scholarship ${scholarship ? "updated" : "added"} successfully!`);
    if (onSuccess) onSuccess();

    if (!scholarship) {
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
    }
  };

  // Added style object for labels and inputs for spacing
  const labelStyle = { marginBottom: "0.3px", display: "block" };
  const inputStyle = { marginTop: "0.3rem" , marginBottom: "0.8rem", width: "100%", padding: "0.5rem", fontSize: "1rem" };

  return (
    <div className="form-container">
      <h2 className="form-title">{scholarship ? "Update Scholarship" : "Add Scholarship"}</h2>
      <form onSubmit={handleSubmit} className="scholarship-form">
        <section>
          <label style={labelStyle}>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} style={inputStyle} />
          {errors.title && <p className="error-text">{errors.title}</p>}

          <label style={labelStyle}>Department *</label>
          <input name="department" value={form.department} onChange={handleChange} style={inputStyle} />
          {errors.department && <p className="error-text">{errors.department}</p>}

          <label style={labelStyle}>Eligibility *</label>
          <input name="eligibility" value={form.eligibility} onChange={handleChange} style={inputStyle} />
          {errors.eligibility && <p className="error-text">{errors.eligibility}</p>}

          <label style={labelStyle}>Application Deadline *</label>
          <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} style={inputStyle} />
          {errors.applicationDeadline && <p className="error-text">{errors.applicationDeadline}</p>}

          <label style={labelStyle}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={inputStyle} />
          {errors.description && <p className="error-text">{errors.description}</p>}

          <label style={labelStyle}>Amount *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            step="0.01"
            style={inputStyle}
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          <label style={labelStyle}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </section>

        <button className="btn-submit" type="submit">{scholarship ? "Update" : "Save"} Scholarship</button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              marginTop: "1rem",
              width: "fit-content",
              padding: "0.8rem 1.5rem",
              backgroundColor: "#ccc",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default ScholarshipForm;
