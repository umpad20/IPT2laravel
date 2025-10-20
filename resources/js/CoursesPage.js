import React from "react";
import "../sass/courses.scss";

function CoursesPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Courses Management</h1>
        <p>Manage the list of courses offered by the institution.</p>
      </header>

      <section className="page-content">
        <button className="add-btn">+ Add New Course</button>
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CS101</td>
              <td>Introduction to Computing</td>
              <td>Computer Science</td>
              <td><button className="edit-btn">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default CoursesPage;
