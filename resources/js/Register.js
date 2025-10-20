import React, { useState } from "react";
import axios from "./utils/axios"; // import axios instance

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", form);
      alert(res.data.message);
      window.location.href = "/login"; // go to login
    } catch (err) {
      alert(err.response.data.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="password" name="password_confirmation" placeholder="Confirm Password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}
