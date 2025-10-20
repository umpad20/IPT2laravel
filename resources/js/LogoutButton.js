import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // call Laravel logout
      localStorage.removeItem("user"); // clear frontend login info
      navigate("/login"); // redirect to login
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed, try again!");
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

export default LogoutButton;
