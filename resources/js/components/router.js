import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout (go up one folder to reach js/)
import DashboardLayout from "../DashboardLayout";

// Pages (also up one folder)
import HomePage from "../HomePage";
import DashboardPage from "../DashboardPage";
import FacultyPage from "../FacultyPage";
import StudentsPage from "../StudentsPage";
import CoursesPage from "../CoursesPage";
import DepartmentsPage from "../DepartmentsPage";
import ReportPage from "../ReportPage";
import ProfilePage from "../ProfilePage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/home" />} />

        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default Router;
