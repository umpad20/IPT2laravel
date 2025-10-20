import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../sass/login.scss"; // make sure you have this for styling

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(); // update Router state
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Log In</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
