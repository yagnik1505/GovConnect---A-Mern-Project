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

      if (!res.ok || !data.token || !data.user) {
        setErrors({ api: data?.message || "Invalid credentials" });
        return;
      }

      const userType = data.user.userType ? data.user.userType.toLowerCase() : "public";
      const designation = data.user.designation ? data.user.designation.toLowerCase() : "user";

      // Save both to localStorage for further use
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userType,
          designation,
          name: data.user.name || "",
          email: data.user.email || "",
          id: data.user._id,
        })
      );

      // Navigation based on the composite role
      if (userType === "government" && designation === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setBusy(false);
      setErrors({ api: "Network or server error" });
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
