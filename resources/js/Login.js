import React, { useState } from "react";
import axios from "./utils/axios";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", form);
      alert(res.data.message);
      window.location.href = "/home"; // redirect to dashboard/home
    } catch(err) {
      alert(err.response.data.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}
