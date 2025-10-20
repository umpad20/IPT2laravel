import React, { useState, useEffect } from "react";
import "../sass/faculty.scss";

function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    // Fetch faculty data or use fallback
    const fetchFaculty = async () => {
      try {
        const res = await fetch("/api/faculty");
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setFacultyList(data);
      } catch {
        // Fallback data
        setFacultyList([
          { id: 1, name: "Dr. John Doe", department: "CSP" },
          { id: 2, name: "Prof. Jane Smith", department: "ETP" },
          { id: 3, name: "Dr. Alan Turing", department: "THMP" },
        ]);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="faculty-page">
      <h2 className="page-title">Faculty List</h2>
      <table className="table table-hover table-striped">
        <thead className="table-header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.name}</td>
              <td>{f.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FacultyPage;
