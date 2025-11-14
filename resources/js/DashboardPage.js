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
import axios from "./axios";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live data from API and synthesize dashboard metrics
    let mounted = true;
    const load = async () => {
      try {
        const [sRes, fRes, dRes, cRes] = await Promise.all([
          axios.get('/api/student').catch(() => ({ data: [] })),
          axios.get('/api/faculty').catch(() => ({ data: [] })),
          axios.get('/api/departments').catch(() => ({ data: [] })),
          axios.get('/api/course').catch(() => ({ data: [] })),
        ]);

        const students = sRes.data?.data || sRes.data || [];
        const faculties = fRes.data?.data || fRes.data || [];
        const departments = dRes.data?.data || dRes.data || [];
        const courses = cRes.data?.data || cRes.data || [];

        if (!mounted) return;

        const totalStudents = Array.isArray(students) ? students.length : 0;
        const totalFaculty = Array.isArray(faculties) ? faculties.length : 0;
        const totalDepartments = Array.isArray(departments) ? departments.length : 0;
        const totalCourses = Array.isArray(courses) ? courses.length : 0;

        // students per course (group by course name)
        const studentsPerCourse = {};
        (students || []).forEach((st) => {
          const name = st.course?.name || st.course_name || `Course ${st.course_id || 'N/A'}`;
          studentsPerCourse[name] = (studentsPerCourse[name] || 0) + 1;
        });

        // faculty per department
        const facultyPerDepartment = {};
        (faculties || []).forEach((f) => {
          const name = f.department?.name || f.department_name || `Dept ${f.department_id || 'N/A'}`;
          facultyPerDepartment[name] = (facultyPerDepartment[name] || 0) + 1;
        });

        // recent activities: synthesize from newest students and faculty records
        const recentActivities = [];
        if (Array.isArray(students)) {
          students.slice(-5).reverse().forEach((st) => {
            recentActivities.push({ description: `Student enrolled: ${st.first_name} ${st.last_name}`, date: st.created_at || st.createdAt || st.registered_at || null });
          });
        }
        if (Array.isArray(faculties)) {
          faculties.slice(-3).reverse().forEach((f) => {
            recentActivities.push({ description: `Faculty added: ${f.name}`, date: f.created_at || f.createdAt || null });
          });
        }

        // alerts: low-enrollment courses
        const alerts = [];
        Object.entries(studentsPerCourse).forEach(([course, count]) => {
          if (count <= 5) alerts.push({ message: `Low enrollment: ${course} (${count})`, priority: 'medium', dueDate: null });
        });

        setData({ totalStudents, totalFaculty, totalDepartments, totalCourses, studentsPerCourse, facultyPerDepartment, recentActivities, alerts });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const studentsPerCourseData = {
    // show top 6 courses by enrollment
    labels: Object.entries(data.studentsPerCourse || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map((r) => r[0]),
    datasets: [
      {
        label: "Students",
        data: Object.entries(data.studentsPerCourse || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map((r) => r[1]),
        backgroundColor: "rgba(59, 130, 246, 0.9)",
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const facultyPerDepartmentData = {
    labels: Object.entries(data.facultyPerDepartment || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map((r) => r[0]),
    datasets: [
      {
        label: "Faculty",
        data: Object.entries(data.facultyPerDepartment || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map((r) => r[1]),
        backgroundColor: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"],
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
      {loading ? (
        <div className="dashboard-loading">Loading dashboard…</div>
      ) : null}

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Total Students</div>
          <div className="metric-value">{data.totalStudents}</div>
          <div className="metric-note">Across all departments and years</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Faculty</div>
          <div className="metric-value">{data.totalFaculty}</div>
          <div className="metric-note">Active teaching staff</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Departments</div>
          <div className="metric-value">{data.totalDepartments}</div>
          <div className="metric-note">Academic units</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Courses</div>
          <div className="metric-value">{data.totalCourses}</div>
          <div className="metric-note">Offered this term</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h6>Students Per Course</h6>
          <div style={{ flex: 1, minHeight: 220 }}>
            <Bar data={studentsPerCourseData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h6>Faculty Per Department</h6>
          <div style={{ flex: 1, minHeight: 220 }}>
            <Pie data={facultyPerDepartmentData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="activities-alerts">
        <div className="activities">
          <h6>Recent Activities</h6>
          <ul className="list-group">
            {data.recentActivities.map((act, idx) => (
              <li key={idx} className="list-group-item">
                <div className="activity-desc">{act.description}</div>
                {act.date ? <div className="text-muted small">{new Date(act.date).toLocaleDateString()}</div> : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="alerts">
          <h6>Alerts</h6>
          <ul className="list-group alerts-list">
            {data.alerts.map((a, i) => (
              <li key={i} className={`list-group-item ${a.priority === 'high' ? 'alert-high' : a.priority === 'medium' ? 'alert-medium' : 'alert-low'}`}>
                <div className="alert-message">{a.message}</div>
                {a.dueDate ? <div className="text-muted small">Due: {new Date(a.dueDate).toLocaleDateString()}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
