import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../sass/dashboard.scss";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Removed the "Courses" link here
  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/faculty", label: "Faculty" },
    { path: "/students", label: "Students" },
    { path: "/departments", label: "Departments" },
    { path: "/report", label: "Report" },
    { path: "/profile", label: "Profile" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed, please try again.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <aside className={`sidebar bg-light ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
          {isSidebarOpen && <h4>Jaypee Uni</h4>}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "<<" : ">>"}
          </button>
        </div>

        <nav className="nav flex-column mt-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link text-dark ${isActive ? "active" : ""}`
              }
            >
              {isSidebarOpen ? link.label : link.label[0]}
            </NavLink>
          ))}

          {/* Logout button at bottom */}
          <button
            className="btn btn-outline-danger mt-2 w-100 logout-btn"
            onClick={handleLogout}
          >
            {isSidebarOpen ? "Logout" : "L"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-grow-1">
        <div className="main-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
