// resources/js/StudentsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../sass/students.scss";

const DEPARTMENTS = ["College of Engineering", "CSP", "ETP", "THMP", "ASP"];
const COURSES = ["BS Information Technology", "BSIT", "BSCS", "BSEd", "BBA", "BSHM"];
const ACADEMIC_YEARS = ["2024-2025", "2025-2026", "2026-2027"];
const ENROLLMENT_STATUS = ["Active", "Inactive", "Graduated"];
const GENDERS = ["Male", "Female", "Other"];

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'add' | 'details'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);

  // Form initial
  const initialForm = {
    id: "",
    student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "",
    birth_date: "",
    age: "",
    nationality: "",
    religion: "",

    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip_code: "",

    department: "",
    course: "",
    year_level: "",
    academic_year: "2025-2026",
    section: "",
    enrollment_status: "Active",

    guardian_name: "",
    guardian_relationship: "",
    guardian_contact: "",
    guardian_address: "",
    same_as_student_address: false,
  };

  const [formData, setFormData] = useState(initialForm);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/student");
      const data = res.data.data || [];
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setStudents([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtering + search
  useEffect(() => {
    let data = [...students];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      data = data.filter(s => {
        const full = `${s.first_name} ${s.middle_name || ""} ${s.last_name}`.toLowerCase();
        return full.includes(t) || (s.student_id || "").toLowerCase().includes(t) || (s.email || "").toLowerCase().includes(t);
      });
    }
    if (filterDept) data = data.filter(s => s.department === filterDept);
    if (filterCourse) data = data.filter(s => s.course === filterCourse);
    setFiltered(data);
  }, [searchTerm, filterDept, filterCourse, students]);

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "same_as_student_address") {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          same_as_student_address: true,
          guardian_address: prev.address || ""
        }));
      } else {
        setFormData(prev => ({ ...prev, same_as_student_address: false }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Compute age from birth_date (integer) before sending
  const computeAge = (birthDate) => {
    if (!birthDate) return null;
    const b = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side required checks
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.department || !formData.course || !formData.year_level) {
      alert("Please fill required fields: First Name, Last Name, Email, Department, Course, Year Level.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_id: formData.student_id || null,
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name?.trim() || null,
        last_name: formData.last_name.trim(),
        suffix: formData.suffix?.trim() || null,
        gender: formData.gender || null,
        birth_date: formData.birth_date || null,
        age: computeAge(formData.birth_date),
        nationality: formData.nationality || null,
        religion: formData.religion || null,

        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        address: formData.address || null,
        city: formData.city || null,
        province: formData.province || null,
        zip_code: formData.zip_code || null,

        department: formData.department || null,
        course: formData.course || null,
        year_level: parseInt(formData.year_level) || null,
        academic_year: formData.academic_year || null,
        section: formData.section || null,
        enrollment_status: formData.enrollment_status || 'Active',

        guardian_name: formData.guardian_name || null,
        guardian_relationship: formData.guardian_relationship || null,
        guardian_contact: formData.guardian_contact || null,
        guardian_address: formData.guardian_address || null,
      };

      if (editing && formData.id) {
        await axios.put(`/api/student/${formData.id}`, payload);
      } else {
        await axios.post("/api/student", payload);
      }

      await fetchStudents();
      setFormData(initialForm);
      setEditing(false);
      setView("list");
    } catch (err) {
      console.error("Save error:", err);
      const errors = err.response?.data?.errors || null;
      if (errors) {
        let msg = "Validation failed:\n";
        Object.keys(errors).forEach(k => { msg += `• ${k}: ${errors[k][0]}\n`; });
        alert(msg);
      } else {
        alert("An error occurred while saving.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setFormData({
      id: s.id,
      student_id: s.student_id || "",
      first_name: s.first_name || "",
      middle_name: s.middle_name || "",
      last_name: s.last_name || "",
      suffix: s.suffix || "",
      gender: s.gender || "",
      birth_date: s.birth_date ? s.birth_date.split('T')[0] : "",
      age: s.age || "",
      nationality: s.nationality || "",
      religion: s.religion || "",

      email: s.email || "",
      phone: s.phone || "",
      address: s.address || "",
      city: s.city || "",
      province: s.province || "",
      zip_code: s.zip_code || "",

      department: s.department || "",
      course: s.course || "",
      year_level: s.year_level || "",
      academic_year: s.academic_year || "2025-2026",
      section: s.section || "",
      enrollment_status: s.enrollment_status || "Active",

      guardian_name: s.guardian_name || "",
      guardian_relationship: s.guardian_relationship || "",
      guardian_contact: s.guardian_contact || "",
      guardian_address: s.guardian_address || "",
      same_as_student_address: false,
    });
    setEditing(true);
    setView("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetails = (s) => {
    setSelected(s);
    setView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`/api/student/${id}`);
      await fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed.");
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditing(false);
  };

  // Helper to display compact name
  const compactName = (s) => {
    return `${s.first_name} ${s.last_name}` + (s.suffix ? `, ${s.suffix}` : "");
  };

  // Render
  return (
    <div className="students-container">
      <header className="students-header">
        <h1>🎓 Student Management</h1>
        <div className="header-actions">
          <button onClick={() => { setView('list'); resetForm(); }} className={`tab-btn ${view === 'list' ? 'active' : ''}`}>📋 Students</button>
          <button onClick={() => { setView('add'); resetForm(); }} className={`tab-btn ${view === 'add' ? 'active' : ''}`}>➕ Add Student</button>
        </div>
      </header>

      {view === 'list' && (
        <>
          <div className="students-controls">
            <div className="input-wrapper">
              <span className="input-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, id or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="filter-select">
              <option value="">📚 All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="filter-select">
              <option value="">📖 All Courses</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="table-header">
            <h2>📋 Student Records</h2>
            <span className="record-count">{filtered.length} {filtered.length === 1 ? 'student' : 'students'} found</span>
          </div>

          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td><span className="student-id-badge">{s.student_id || "-"}</span></td>
                    <td className="name-cell">{compactName(s)}</td>
                    <td><span className="dept-badge">{s.department || "-"}</span></td>
                    <td><span className="course-badge">{s.course || "-"}</span></td>
                    <td><span className="year-badge">{s.year_level || "-"}</span></td>
                    <td><span className="status-badge">{s.enrollment_status || "Active"}</span></td>
                    <td className="actions">
                      <button onClick={() => handleDetails(s)} className="btn-details">🔍</button>
                      <button onClick={() => handleEdit(s)} className="btn-edit">✏️</button>
                      <button onClick={() => handleDelete(s.id)} className="btn-delete">🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <div className="no-data-content">
                        <span className="no-data-icon">📭</span>
                        <p>No students found</p>
                        <small>Try adjusting your search or filters</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'add' && (
        <form onSubmit={handleSubmit} className="students-form">
          <h2 className="form-title">{editing ? "✏️ Edit Student" : "➕ Add New Student"}</h2>

          <div className="form-grid">
            {/* Basic Info */}
            <fieldset className="card">
              <legend>Basic Information</legend>
              <div className="row">
                <input name="first_name" placeholder="First Name *" value={formData.first_name} onChange={handleChange} required />
                <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
                <input name="last_name" placeholder="Last Name *" value={formData.last_name} onChange={handleChange} required />
                <input name="suffix" placeholder="Suffix (Jr., Sr.)" value={formData.suffix} onChange={handleChange} />
              </div>

              <div className="row">
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input name="birth_date" type="date" placeholder="Date of Birth" value={formData.birth_date} onChange={handleChange} />
                <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />
                <input name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
                <input name="religion" placeholder="Religion" value={formData.religion} onChange={handleChange} />
              </div>
            </fieldset>

            {/* Contact */}
            <fieldset className="card">
              <legend>Contact Information</legend>
              <div className="row">
                <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="row">
                <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="row">
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <input name="province" placeholder="Province" value={formData.province} onChange={handleChange} />
                <input name="zip_code" placeholder="ZIP Code" value={formData.zip_code} onChange={handleChange} />
              </div>
            </fieldset>

            {/* Academic */}
            <fieldset className="card">
              <legend>Academic Information</legend>
              <div className="row">
                <input name="student_id" placeholder="Student ID (optional)" value={formData.student_id} onChange={handleChange} />
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department *</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select name="course" value={formData.course} onChange={handleChange} required>
                  <option value="">Select Course *</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select name="year_level" value={formData.year_level} onChange={handleChange} required>
                    <option value="">Year Level *</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                </select>
              </div>
              <div className="row">
                <select name="academic_year" value={formData.academic_year} onChange={handleChange}>
                  {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input name="section" placeholder="Section" value={formData.section} onChange={handleChange} />
                <select name="enrollment_status" value={formData.enrollment_status} onChange={handleChange}>
                  {ENROLLMENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </fieldset>

            {/* Guardian */}
            <fieldset className="card">
              <legend>Parent / Guardian Information</legend>
              <div className="row">
                <input name="guardian_name" placeholder="Guardian Name" value={formData.guardian_name} onChange={handleChange} />
                <input name="guardian_relationship" placeholder="Relationship" value={formData.guardian_relationship} onChange={handleChange} />
                <input name="guardian_contact" placeholder="Guardian Contact" value={formData.guardian_contact} onChange={handleChange} />
              </div>

              <div className="row">
                <label className="checkbox-inline">
                  <input type="checkbox" name="same_as_student_address" checked={formData.same_as_student_address} onChange={handleChange} />
                  Same as student address
                </label>
              </div>

              <div className="row">
                <textarea name="guardian_address" placeholder="Guardian Address" value={formData.guardian_address} onChange={handleChange} />
              </div>
            </fieldset>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "⏳ Saving..." : (editing ? "💾 Update Student" : "➕ Add Student")}
              </button>
              <button type="button" onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {view === 'details' && selected && (
        <div className="details-panel">
          <button className="back-btn" onClick={() => { setView('list'); setSelected(null); }}>← Back to list</button>
          <h2>🔎 Student Details</h2>

          <div className="details-grid">
            <div className="card">
              <h3>Basic Information</h3>
              <p><strong>Name:</strong> {selected.first_name} {selected.middle_name || ""} {selected.last_name}{selected.suffix ? `, ${selected.suffix}` : ""}</p>
              <p><strong>Gender:</strong> {selected.gender || "-"}</p>
              <p><strong>Birth Date:</strong> {selected.birth_date ? new Date(selected.birth_date).toLocaleDateString() : "-"}</p>
              <p><strong>Age:</strong> {selected.age || "-"}</p>
              <p><strong>Nationality:</strong> {selected.nationality || "-"}</p>
              <p><strong>Religion:</strong> {selected.religion || "-"}</p>
            </div>

            <div className="card">
              <h3>Contact</h3>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone || "-"}</p>
              <p><strong>Address:</strong> {selected.address || "-"}</p>
              <p><strong>City:</strong> {selected.city || "-"}</p>
              <p><strong>Province:</strong> {selected.province || "-"}</p>
              <p><strong>ZIP:</strong> {selected.zip_code || "-"}</p>
            </div>

            <div className="card">
              <h3>Academic</h3>
              <p><strong>Student ID:</strong> {selected.student_id || "-"}</p>
              <p><strong>Department:</strong> {selected.department || "-"}</p>
              <p><strong>Course:</strong> {selected.course || "-"}</p>
              <p><strong>Year Level:</strong> {selected.year_level || "-"}</p>
              <p><strong>Academic Year:</strong> {selected.academic_year || "-"}</p>
              <p><strong>Section:</strong> {selected.section || "-"}</p>
              <p><strong>Status:</strong> {selected.enrollment_status || "-"}</p>
            </div>

            <div className="card">
              <h3>Guardian</h3>
              <p><strong>Name:</strong> {selected.guardian_name || "-"}</p>
              <p><strong>Relationship:</strong> {selected.guardian_relationship || "-"}</p>
              <p><strong>Contact:</strong> {selected.guardian_contact || "-"}</p>
              <p><strong>Address:</strong> {selected.guardian_address || "-"}</p>
            </div>
          </div>

          <div className="details-actions">
            <button onClick={() => { handleEdit(selected); }} className="btn-edit">✏️ Edit</button>
            <button onClick={() => handleDelete(selected.id)} className="btn-delete">🗑️ Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
