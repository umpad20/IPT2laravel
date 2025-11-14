import React, { useEffect, useState } from "react";
import axios from "./axios";
import "../sass/report.scss";

export default function ReportPage() {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [studentAttendance, setStudentAttendance] = useState([]);
  const [facultyActivities, setFacultyActivities] = useState([]);
  const [studentSummary, setStudentSummary] = useState({});
  const [facultySummary, setFacultySummary] = useState({});
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [facultiesLoading, setFacultiesLoading] = useState(false);

  const [newAttendance, setNewAttendance] = useState({ date: "", status: "Present", remarks: "" });
  const [newActivity, setNewActivity] = useState({ activity_type: "Class", course_id: "", schedule_date: "", notes: "" });

  const [searchStudent, setSearchStudent] = useState("");
  const [searchFaculty, setSearchFaculty] = useState("");

  // Load students and faculties dynamically (be defensive about response shape)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setStudentsLoading(true);
        const s = await axios.get("/api/student");
        if (!mounted) return;
        setStudents(s.data?.data || s.data || []);
      } catch (err) {
        console.error('Failed to load students', err);
        setStudents([]);
      } finally { setStudentsLoading(false); }

      try {
        setFacultiesLoading(true);
        const f = await axios.get("/api/faculty");
        if (!mounted) return;
        setFaculties(f.data?.data || f.data || []);
      } catch (err) {
        console.error('Failed to load faculties', err);
        setFaculties([]);
      } finally { setFacultiesLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Auto-select first student/faculty when data loads
  useEffect(() => {
    if (students.length) setSelectedStudent(students[0]);
    if (faculties.length) setSelectedFaculty(faculties[0]);
  }, [students, faculties]);

  // Fetch student attendance dynamically
  useEffect(() => {
    if (!selectedStudent) return;
    axios.get(`/api/student-attendance/${selectedStudent.student_id}`).then(res => {
      const records = res.data?.records || res.data?.data || res.data || [];
      setStudentAttendance(records);
      const total = records.length;
      const present = records.filter(r => r.status === "Present").length;
      const absent = records.filter(r => r.status === "Absent").length;
      setStudentSummary({
        total_classes: total,
        present_count: present,
        absent_count: absent,
        attendance_percentage: total ? Math.round((present / total) * 100) : 0,
      });
    }).catch(err => {
      console.error('Failed to load student attendance', err);
      setStudentAttendance([]);
      setStudentSummary({});
    });
  }, [selectedStudent]);

  // Fetch faculty activities dynamically
  useEffect(() => {
    if (!selectedFaculty) return;
    axios.get(`/api/faculty-activities/${selectedFaculty.id}`).then(res => {
      const records = res.data?.records || res.data?.data || res.data || [];
      setFacultyActivities(records);
      setFacultySummary({
        classes_count: records.filter(r => r.activity_type === "Class").length,
        exams_count: records.filter(r => r.activity_type === "Exam").length,
        meetings_count: records.filter(r => r.activity_type === "Meeting").length,
      });
    }).catch(err => {
      console.error('Failed to load faculty activities', err);
      setFacultyActivities([]);
      setFacultySummary({});
    });
  }, [selectedFaculty]);

  // CRUD Handlers (Student Attendance)
  const handleAddAttendance = () => {
    if (!newAttendance.date) return alert("Select a date");
    axios.post("/api/student-attendance", { ...newAttendance, student_id: selectedStudent.student_id })
      .then(() => setNewAttendance({ date: "", status: "Present", remarks: "" }))
      .then(() => axios.get(`/api/student-attendance/${selectedStudent.student_id}`).then(res => setStudentAttendance(res.data?.records || res.data?.data || res.data || [])));
  };

  const handleDeleteAttendance = (id) => {
    axios.delete(`/api/student-attendance/${id}`)
      .then(() => axios.get(`/api/student-attendance/${selectedStudent.student_id}`).then(res => setStudentAttendance(res.data?.records || res.data?.data || res.data || [])));
  };

  // CRUD Handlers (Faculty Activities)
  const handleAddActivity = () => {
    if (!newActivity.schedule_date) return alert("Select a schedule date");
    axios.post("/api/faculty-activities", { ...newActivity, faculty_id: selectedFaculty.id })
      .then(() => setNewActivity({ activity_type: "Class", course_id: "", schedule_date: "", notes: "" }))
      .then(() => axios.get(`/api/faculty-activities/${selectedFaculty.id}`).then(res => setFacultyActivities(res.data?.records || res.data?.data || res.data || [])));
  };

  const handleDeleteActivity = (id) => {
    axios.delete(`/api/faculty-activities/${id}`)
      .then(() => axios.get(`/api/faculty-activities/${selectedFaculty.id}`).then(res => setFacultyActivities(res.data?.records || res.data?.data || res.data || [])));
  };

  const filteredStudentAttendance = studentAttendance.filter(a => a.date.includes(searchStudent));
  const filteredFacultyActivities = facultyActivities.filter(a => a.notes?.toLowerCase().includes(searchFaculty.toLowerCase()));

  return (
    <div className="report-page">
      <h1>Admin Reports</h1>
      <p>Generate and manage student attendance and faculty activity reports.</p>

      <div className="report-cards">

        {/* --- Student Attendance Report --- */}
        <div className="card report-card">
          <h2>Student Attendance Report</h2>
          <p>Generate detailed attendance summaries.</p>

          <select value={selectedStudent?.student_id || ""} onChange={e => setSelectedStudent(students.find(s => s.student_id === e.target.value))}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name}</option>)}
          </select>

          {selectedStudent && (
            <>
              <div className="report-summary">
                <h3>{selectedStudent.first_name} {selectedStudent.last_name}</h3>
                <ul>
                  <li>Total Classes: {studentSummary.total_classes || 0}</li>
                  <li>Present: {studentSummary.present_count || 0}</li>
                  <li>Absent: {studentSummary.absent_count || 0}</li>
                  <li>Attendance %: {studentSummary.attendance_percentage || 0}%</li>
                </ul>
              </div>

              <div className="report-add">
                <h4>Add Attendance</h4>
                <input type="date" value={newAttendance.date} onChange={e => setNewAttendance({ ...newAttendance, date: e.target.value })} />
                <select value={newAttendance.status} onChange={e => setNewAttendance({ ...newAttendance, status: e.target.value })}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
                <input type="text" placeholder="Remarks" value={newAttendance.remarks} onChange={e => setNewAttendance({ ...newAttendance, remarks: e.target.value })} />
                <button onClick={handleAddAttendance}>Add Attendance</button>
              </div>

              <div className="report-table">
                <h4>Attendance Details</h4>
                <input placeholder="Search by date" value={searchStudent} onChange={e => setSearchStudent(e.target.value)} />
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudentAttendance.map(a => (
                      <tr key={a.id}>
                        <td>{a.date}</td>
                        <td>{a.status}</td>
                        <td>{a.remarks}</td>
                        <td><button onClick={() => handleDeleteAttendance(a.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* --- Faculty Activity Report --- */}
        <div className="card report-card">
          <h2>Faculty Activity Report</h2>
          <p>Monitor faculty activities and exam schedules.</p>

          <select value={selectedFaculty?.id || ""} onChange={e => setSelectedFaculty(faculties.find(f => f.id.toString() === e.target.value))}>
            <option value="">Select Faculty</option>
            {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>

          {selectedFaculty && (
            <>
              <div className="report-summary">
                <h3>{selectedFaculty.name}</h3>
                <ul>
                  <li>Classes: {facultySummary.classes_count || 0}</li>
                  <li>Exams: {facultySummary.exams_count || 0}</li>
                  <li>Meetings: {facultySummary.meetings_count || 0}</li>
                </ul>
              </div>

              <div className="report-add">
                <h4>Add Activity</h4>
                <select value={newActivity.activity_type} onChange={e => setNewActivity({ ...newActivity, activity_type: e.target.value })}>
                  <option>Class</option>
                  <option>Exam</option>
                  <option>Meeting</option>
                </select>
                <input type="text" placeholder="Course ID" value={newActivity.course_id} onChange={e => setNewActivity({ ...newActivity, course_id: e.target.value })} />
                <input type="date" value={newActivity.schedule_date} onChange={e => setNewActivity({ ...newActivity, schedule_date: e.target.value })} />
                <input type="text" placeholder="Notes" value={newActivity.notes} onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })} />
                <button onClick={handleAddActivity}>Add Activity</button>
              </div>

              <div className="report-table">
                <h4>Activities</h4>
                <input placeholder="Search notes" value={searchFaculty} onChange={e => setSearchFaculty(e.target.value)} />
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFacultyActivities.map(a => (
                      <tr key={a.id}>
                        <td>{a.activity_type}</td>
                        <td>{a.course_id || ""}</td>
                        <td>{a.schedule_date}</td>
                        <td>{a.notes || ""}</td>
                        <td><button onClick={() => handleDeleteActivity(a.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
