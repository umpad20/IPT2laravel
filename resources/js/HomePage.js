import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem("user")) {
      navigate("/login"); // redirect to login if not
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Jaypee University Dashboard</h1>
      <p>
        This is the home page. Here you can put general information, 
        announcements, or a quick overview of the system.
      </p>
      <p>For example: "Total Students: 50, Total Faculty: 10, Active Courses: 12"</p>
      <p>You can also add quick links or important messages here.</p>
    </div>
  );
}

export default HomePage;
