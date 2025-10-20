import React, { useState, useEffect } from "react";
import "../sass/students.scss";

function StudentsPage() {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    // Fetch student data or use fallback
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setStudentList(data);
      } catch {
        setStudentList([
          { id: 1, name: "Alice Johnson", course: "CSP101" },
          { id: 2, name: "Bob Martin", course: "ETP101" },
          { id: 3, name: "Charlie Brown", course: "THMP101" },
        ]);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="students-page">
      <h2 className="page-title">Students List</h2>
      <table className="table table-hover table-striped">
        <thead className="table-header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsPage;
