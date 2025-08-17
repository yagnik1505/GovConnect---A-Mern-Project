import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    userType: "Public", department: "", designation: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!emailRx.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.userType === "Government") {
      if (!form.department.trim()) e.department = "Department required";
      if (!form.designation.trim()) e.designation = "Designation required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const payload = { ...form };
    const { res, data } = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setErrors({ api: data.message || "Registration failed" });
      return;
    }
    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="form-card">
        <h2>Create Account</h2>
        <p>Public or Government — your choice.</p>

        {errors.api && <p className="error-text">{errors.api}</p>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input
              className={errors.name ? "input-error" : ""}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Ananya Sharma"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              className={errors.email ? "input-error" : ""}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              className={errors.password ? "input-error" : ""}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div>
            <label>User Type</label>
            <select value={form.userType} onChange={(e) => set("userType", e.target.value)}>
              <option value="Public">Public</option>
              <option value="Government">Government</option>
            </select>
          </div>

          {form.userType === "Government" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label>Department</label>
                <input
                  className={errors.department ? "input-error" : ""}
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                />
                {errors.department && <p className="error-text">{errors.department}</p>}
              </div>
              <div>
                <label>Designation</label>
                <input
                  className={errors.designation ? "input-error" : ""}
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                />
                {errors.designation && <p className="error-text">{errors.designation}</p>}
              </div>
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
