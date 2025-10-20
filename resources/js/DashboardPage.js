import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../sass/dashboard.scss";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function DashboardPage() {
  const [data, setData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalCourses: 0,
    studentsPerCourse: {},
    facultyPerDepartment: {},
    recentActivities: [],
    alerts: [],
  });

  useEffect(() => {
    // Mock data
    setData({
      totalStudents: 50,
      totalFaculty: 10,
      totalDepartments: 6,
      totalCourses: 18,
      studentsPerCourse: { CSP101: 12, CSP102: 8, ETP101: 10, THMP101: 6, ASP101: 14 },
      facultyPerDepartment: { CSP: 6, ETP: 4, THMP: 3, ASP: 5, NP: 2 },
      recentActivities: [
        { description: "New student enrolled", date: "2025-10-13" },
        { description: "Faculty updated", date: "2025-10-12" },
      ],
      alerts: [
        { message: "Exam schedule released", priority: "high", dueDate: "2025-11-30" },
      ],
    });
  }, []);

  const studentsPerCourseData = {
    labels: Object.keys(data.studentsPerCourse),
    datasets: [
      {
        label: "Students",
        data: Object.values(data.studentsPerCourse),
        backgroundColor: "rgba(59, 130, 246, 0.85)",
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const facultyPerDepartmentData = {
    labels: Object.keys(data.facultyPerDepartment),
    datasets: [
      {
        label: "Faculty",
        data: Object.values(data.facultyPerDepartment),
        backgroundColor: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, title: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard Overview</h2>

      <div className="row metrics-row mb-4">
        <div className="col metric-card">
          <small>Total Students</small>
          <h4>{data.totalStudents}</h4>
        </div>
        <div className="col metric-card">
          <small>Total Faculty</small>
          <h4>{data.totalFaculty}</h4>
        </div>
        <div className="col metric-card">
          <small>Departments</small>
          <h4>{data.totalDepartments}</h4>
        </div>
        <div className="col metric-card">
          <small>Courses</small>
          <h4>{data.totalCourses}</h4>
        </div>
      </div>

      <div className="row charts-row mb-4">
        <div className="col-lg-7 chart-card">
          <h6>Students Per Course</h6>
          <div style={{ height: 260 }}>
            <Bar data={studentsPerCourseData} options={chartOptions} />
          </div>
        </div>

        <div className="col-lg-5 chart-card">
          <h6>Faculty Per Department</h6>
          <div style={{ height: 260 }}>
            <Pie data={facultyPerDepartmentData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="row activities-alerts">
        <div className="col-lg-7">
          <h6>Recent Activities</h6>
          <ul className="list-group">
            {data.recentActivities.map((act, idx) => (
              <li key={idx} className="list-group-item">
                <strong>{act.description}</strong>
                <div className="text-muted small">{new Date(act.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-5">
          <h6>Alerts</h6>
          <ul className="list-group">
            {data.alerts.map((a, i) => (
              <li key={i} className="list-group-item">
                <div className={a.priority === "high" ? "text-danger" : "text-warning"}>{a.message}</div>
                <div className="text-muted small">Due: {new Date(a.dueDate).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
