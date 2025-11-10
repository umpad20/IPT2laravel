import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/faculty.scss";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    id: "", name: "", email: "", contact_number: "",
    department_id: "", course_id: "", position: "", office_location: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("/api/faculty");
      setFaculty(res.data.data ?? []);
    } catch (err) { setFaculty([]); console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments");
      // DepartmentController::index returns a raw array, while FacultyController::departments
      // returns { data: [...] }. Support both shapes.
      const payload = res.data;
      if (Array.isArray(payload)) setDepartments(payload);
      else setDepartments(payload.data ?? []);
    } catch (err) { setDepartments([]); console.error(err); }
  };

  const fetchCourses = async (department_id) => {
    if (!department_id) { setCourses([]); return; }
    try {
      // correct endpoint is singular /api/course (defined in routes)
      const res = await axios.get(`/api/course?department_id=${department_id}`);
      setCourses(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      // fallback: if departments were fetched and include nested courses, derive from them
      try {
        const dept = Array.isArray(departments) ? departments.find(d => String(d.id) === String(department_id)) : null;
        if (dept && Array.isArray(dept.courses) && dept.courses.length) setCourses(dept.courses);
        else setCourses([]);
      } catch (inner) { console.error(inner); setCourses([]); }
    }
  };

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setForm(prev => ({ ...prev, department_id: deptId, course_id: "" }));
    fetchCourses(deptId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department_id || !form.course_id) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      if (editing) await axios.put(`/api/faculty/${form.id}`, form);
      else await axios.post("/api/faculty", form);
      setForm({ id: "", name: "", email: "", contact_number: "", department_id: "", course_id: "", position: "", office_location: "" });
      setEditing(false);
      await fetchFaculty();
      // after saving, return to the list tab
      setActiveTab('list');
      // small scroll to show the table
      setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 80);
    } catch (err) { console.error(err); alert("Error saving faculty"); }
    finally { setLoading(false); }
  };

  const handleEdit = (f) => {
    setForm({
      id: f.id, name: f.name, email: f.email, contact_number: f.contact_number,
      department_id: f.department_id, course_id: f.course_id,
      position: f.position, office_location: f.office_location
    });
    fetchCourses(f.department_id);
    setEditing(true);
    setActiveTab('add');
    // scroll to form area
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty?")) return;
    try { await axios.delete(`/api/faculty/${id}`); fetchFaculty(); }
    catch (err) { console.error(err); alert("Delete failed"); }
  };

  return (
    <div className="faculty-page">
      <header className="faculty-header">
        <div className="title-wrap">
          <h1>Faculty</h1>
          <p className="muted">Manage faculty members, their departments and assigned courses.</p>
        </div>
        <div className="controls">
          <div className="tabs" role="tablist">
            <button className={activeTab === 'list' ? 'tab active' : 'tab'} onClick={() => setActiveTab('list')} role="tab">Faculty List</button>
            <button className={activeTab === 'add' ? 'tab active' : 'tab'} onClick={() => { setActiveTab('add'); setEditing(false); setForm({ id: "", name: "", email: "", contact_number: "", department_id: "", course_id: "", position: "", office_location: "" }); }} role="tab">Add Faculty</button>
          </div>

          <input
            className="search"
            placeholder="Search by name, email or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search faculty"
          />
        </div>
      </header>

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="faculty-form" style={{marginBottom:20}}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange} />

          <select name="department_id" value={form.department_id} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            {Array.isArray(departments) && departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <select name="course_id" value={form.course_id} onChange={handleChange} required disabled={!form.department_id}>
            <option value="">{form.department_id ? 'Select Course' : 'Select Department first'}</option>
            {Array.isArray(courses) && courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
          <input name="office_location" placeholder="Office Location" value={form.office_location} onChange={handleChange} />

          <div style={{display:'flex',gap:10}}>
            <button type="submit" disabled={loading} className="primary-btn">{loading ? 'Saving...' : (editing ? 'Update' : 'Add')}</button>
            {editing && <button type="button" className="secondary-btn" onClick={() => { setEditing(false); setForm({ id: "", name: "", email: "", contact_number: "", department_id: "", course_id: "", position: "", office_location: "" }); setActiveTab('list'); }}>Cancel</button>}
          </div>
        </form>
      )}

      <section className={activeTab === 'list' ? 'tab-content active' : 'tab-content'}>
        <table className="faculty-table">
          <thead>
            <tr>
              <th style={{width:40}}>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Course</th>
              <th>Position</th>
              <th>Office</th>
              <th style={{width:140}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const q = String(search || '').trim().toLowerCase();
              const filtered = Array.isArray(faculty) ? faculty.filter(f => {
                if (!q) return true;
                return [f.name, f.email, f.position, f.department?.name, f.course?.name].join(' ').toLowerCase().includes(q);
              }) : [];
              if (filtered.length === 0) return (<tr><td colSpan="9">No faculty found.</td></tr>);
              return filtered.map((f, idx) => (
                <tr key={f.id}>
                  <td>{idx + 1}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.contact_number}</td>
                  <td>{f.department?.name ?? ""}</td>
                  <td>{f.course?.name ?? ""}</td>
                  <td>{f.position}</td>
                  <td>{f.office_location}</td>
                  <td className="actions">
                    <button className="edit" onClick={() => handleEdit(f)}>✏️ Edit</button>
                    <button className="delete" onClick={() => handleDelete(f.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </section>
    </div>
  );
}
