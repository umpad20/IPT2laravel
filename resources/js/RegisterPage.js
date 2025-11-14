import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../sass/register.scss"; // make sure you have this for styling

function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/register", form);
      // After signup, do NOT auto-login — redirect user to the login page
      // Backend returns a success message; send user to /login to authenticate
      navigate("/login");
    } catch (err) {
      // backend validation messages
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).join(" ")
          : err.response?.data?.message || "Registration failed.";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
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

          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log In</span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
