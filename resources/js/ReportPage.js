import React from "react";
import "../sass/report.scss";

function ReportPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Reports</h1>
        <p>Generate and review system reports.</p>
      </header>

      <section className="page-content">
        <div className="report-card">
          <h3>Student Attendance Report</h3>
          <p>Generate detailed attendance summaries.</p>
          <button className="view-btn">View Report</button>
        </div>

        <div className="report-card">
          <h3>Faculty Activity Report</h3>
          <p>Monitor faculty activities and exam schedules.</p>
          <button className="view-btn">View Report</button>
        </div>
      </section>
    </div>
  );
}

export default ReportPage;
