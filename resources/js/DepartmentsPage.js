import React, { useEffect, useState } from "react";
import axios from "axios";
import "../sass/departments.scss";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [search, setSearch] = useState("");
  const [newDept, setNewDept] = useState({
    code: "",
    name: "",
    description: "",
    head: "",
    dean_email: "",
    dean_contact: "",
    office_location: "",
  });
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
    year_level: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments");
      const list = res.data.data ?? res.data;
      setDepartments(list);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchDepartment = async (id) => {
    try {
      const res = await axios.get(`/api/departments/${id}`);
      return res.data.data ?? res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // --- Department CRUD ---
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.code.trim() || !newDept.name.trim()) return alert("Code and Name required");
    setLoading(true);
    try {
      if (newDept.id) {
        await axios.put(`/api/departments/${newDept.id}`, newDept);
      } else {
        await axios.post("/api/departments", newDept);
      }
      setNewDept({ code: "", name: "", description: "", head: "", dean_email: "", dean_contact: "", office_location: "" });
      await fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Error saving department");
    } finally { setLoading(false); }
  };

  const handleDeleteDepartment = async (id) => {
    if (!confirm("Delete this department? This will remove its courses.")) return;
    try {
      await axios.delete(`/api/departments/${id}`);
      if (selectedDept?.id === id) setSelectedDept(null);
      await fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Error deleting department");
    }
  };

  const handleEditDepartment = (dept) => {
    setNewDept(dept);
  };

  // --- Course CRUD ---
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.code.trim() || !newCourse.name.trim()) return alert("Code and Name required");
    setLoading(true);
    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse.id}`, newCourse);
        setEditingCourse(null);
      } else {
        await axios.post("/api/courses", { ...newCourse, department_id: selectedDept.id });
      }
      setNewCourse({ code: "", name: "", description: "", year_level: "" });
      const dept = await fetchDepartment(selectedDept.id);
      setSelectedDept(dept);
    } catch (err) {
      console.error(err);
      alert("Error saving course");
    } finally { setLoading(false); }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      const dept = await fetchDepartment(selectedDept.id);
      setSelectedDept(dept);
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse({
      code: course.code,
      name: course.name,
      description: course.description,
      year_level: course.year_level,
    });
  };

  const cancelEditCourse = () => {
    setEditingCourse(null);
    setNewCourse({ code: "", name: "", description: "", year_level: "" });
  };

  const filteredDepartments = departments.filter((d) =>
    (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="departments-container">
      <header className="dept-header">
        <h1>📚 Department & Course Management</h1>
        <p className="subtitle">Manage programs, deans, and courses</p>
      </header>

      {/* Department Form */}
      <div className="dept-form-card">
        <form onSubmit={handleAddDepartment}>
          <h3>{newDept.id ? "Edit Department" : "Add Department"}</h3>
          <div className="form-row">
            <input type="text" placeholder="Code" value={newDept.code} onChange={e => setNewDept({ ...newDept, code: e.target.value })} required />
            <input type="text" placeholder="Name" value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Head/Dean" value={newDept.head} onChange={e => setNewDept({ ...newDept, head: e.target.value })} />
            <input type="email" placeholder="Dean Email" value={newDept.dean_email} onChange={e => setNewDept({ ...newDept, dean_email: e.target.value })} />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Dean Contact" value={newDept.dean_contact} onChange={e => setNewDept({ ...newDept, dean_contact: e.target.value })} />
            <input type="text" placeholder="Office Location" value={newDept.office_location} onChange={e => setNewDept({ ...newDept, office_location: e.target.value })} />
          </div>
          <textarea placeholder="Description" value={newDept.description} onChange={e => setNewDept({ ...newDept, description: e.target.value })} />
          <div className="form-actions">
            <button type="submit">{loading ? "⏳ Saving..." : newDept.id ? "Update Department" : "Add Department"}</button>
            {newDept.id && <button type="button" className="btn-secondary" onClick={() => setNewDept({ code: "", name: "", description: "", head: "", dean_email: "", dean_contact: "", office_location: "" })}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input type="text" placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Department Table */}
      <table className="dept-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Head</th>
            <th>Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map(d => (
            <tr key={d.id} className={selectedDept?.id === d.id ? "active" : ""} onClick={async () => setSelectedDept(await fetchDepartment(d.id))}>
              <td>{d.code}</td>
              <td>{d.name}</td>
              <td>{d.head || "-"}</td>
              <td>{d.courses?.length || 0}</td>
              <td>
                <button onClick={e => { e.stopPropagation(); handleEditDepartment(d); }}>✏️</button>
                <button onClick={e => { e.stopPropagation(); handleDeleteDepartment(d.id); }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Courses Section */}
      {selectedDept && (
        <div className="courses-card">
          <h3>Courses in {selectedDept.name} ({selectedDept.code})</h3>
          <table>
            <thead>
              <tr><th>Code</th><th>Name</th><th>Year</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {selectedDept.courses?.length > 0 ? selectedDept.courses.map(c => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.year_level}</td>
                  <td>{c.description}</td>
                  <td>
                    <button onClick={() => handleEditCourse(c)}>✏️</button>
                    <button onClick={() => handleDeleteCourse(c.id)}>🗑️</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5">No courses found</td></tr>}
            </tbody>
          </table>

          {/* Add/Edit Course Form */}
          <form onSubmit={handleSubmitCourse} className="course-form">
            <h4>{editingCourse ? "Edit Course" : "Add Course"}</h4>
            <input placeholder="Course Code" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} required />
            <input placeholder="Course Name" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} required />
            <input placeholder="Year Level" type="number" value={newCourse.year_level} onChange={e => setNewCourse({ ...newCourse, year_level: e.target.value })} />
            <textarea placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}></textarea>
            <div className="form-actions">
              <button type="submit">{loading ? "⏳ Saving..." : editingCourse ? "Update Course" : "Add Course"}</button>
              {editingCourse && <button type="button" className="btn-secondary" onClick={cancelEditCourse}>Cancel</button>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
