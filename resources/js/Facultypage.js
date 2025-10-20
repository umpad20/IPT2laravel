import React, { useEffect, useState } from "react";
import axios from "axios";
import "../sass/faculty.scss";

function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", course: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const departments = ["CSP", "CJEP", "THMP", "AP", "ASP", "BAP", "TEP", "ETP", "NP"];
  const coursesPerDept = {
    CSP: ["BSIT", "BSCS"],
    CJEP: ["BSJ", "BSEd"],
    THMP: ["Bachelor of Hospitality", "Bachelor of Tourism"],
    AP: ["BS Accountancy"],
    ASP: ["BS Psychology"],
    BAP: ["BS Architecture"],
    TEP: ["Technical Education Program"],
    ETP: ["Engineering Tech Program"],
    NP: ["Nursing"],
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("/api/faculty");
      setFacultyList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/faculty/${editingId}`, form);
      } else {
        await axios.post("/api/faculty", form);
      }
      setForm({ name: "", department: "", course: "" });
      setEditingId(null);
      fetchFaculty();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (faculty) => {
    setForm({
      name: faculty.name,
      department: faculty.department,
      course: faculty.course,
    });
    setEditingId(faculty.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      await axios.delete(`/api/faculty/${id}`);
      fetchFaculty();
    }
  };

  // Filter faculty list by search
  const filteredList = facultyList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-page">
      <h2>Faculty Management</h2>

      <div className="faculty-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Faculty Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            {coursesPerDept[form.department]?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>
      </div>

      <div className="faculty-search">
        <input
          type="text"
          placeholder="Search faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="faculty-table-wrapper">
        <table className="faculty-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{f.department}</td>
                <td>{f.course}</td>
                <td>
                  <button onClick={() => handleEdit(f)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No faculty found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FacultyPage;
