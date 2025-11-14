import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "../DashboardLayout";

// Pages
import DashboardPage from "../DashboardPage";
import FacultyPage from "../Facultypage";
import StudentsPage from "../StudentsPage";
import CoursesPage from "../CoursesPage";
import DepartmentsPage from "../DepartmentsPage";
// ReportPage removed
import ProfilePage from "../ProfilePage";

// Auth
import LoginPage from "../LoginPage";
import RegisterPage from "../RegisterPage";

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
      />
      <Route
        path="/register"
        element={<RegisterPage onRegister={() => setIsLoggedIn(true)} />}
      />

      {/* Private routes */}
      <Route
        path="/"
        element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
      >
  <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default Router;
