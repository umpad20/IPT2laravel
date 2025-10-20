import React from "react";
import "../sass/departments.scss";

function DepartmentPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Department Overview</h1>
        <p>View and manage all academic departments.</p>
      </header>

      <section className="page-content">
        <button className="add-btn">+ Add Department</button>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Head</th>
              <th>Faculty Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Information Technology</td>
              <td>Dr. Santos</td>
              <td>15</td>
              <td><button className="edit-btn">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default DepartmentPage;
