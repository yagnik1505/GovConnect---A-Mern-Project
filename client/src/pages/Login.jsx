import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!emailRx.test(form.email)) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setBusy(true);
    try {
      const { res, data } = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setBusy(false);

      // Check for token and user securely
      if (!res.ok || !data.token || !data.user) {
        setErrors({ api: data?.message || "Invalid email or password" });
        return;
      }

      // Defensive lowercasing and fallback for missing fields
      const designation = (data.user.designation || "").toLowerCase();
      const userType = (data.user.userType || "").toLowerCase();
      const name = data.user.name || "";

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ designation, userType, name })
      );

      if (designation === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setBusy(false);
      setErrors({ api: "Network error or server unreachable" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="form-card">
        <h2>Login</h2>
        <p>Welcome back to GovConnect.</p>

        {errors.api && <p className="error-text">{errors.api}</p>}

        <form onSubmit={submit} className="space-y-4">
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
              placeholder="Your password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
