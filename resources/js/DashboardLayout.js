import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../sass/dashboard.scss";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/faculty", label: "Faculty" },
    { path: "/students", label: "Students" },
    { path: "/courses", label: "Courses" },
    { path: "/departments", label: "Departments" },
    { path: "/report", label: "Report" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <aside
        className={`sidebar bg-light ${isSidebarOpen ? "open" : "collapsed"}`}
      >
        <div className="sidebar-header p-3">
          {isSidebarOpen && <h4>Jaypee Uni</h4>}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "<<" : ">>"}
          </button>
        </div>

        <nav className="nav flex-column">
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
