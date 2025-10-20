import React, { useState } from "react";
import "../sass/home.scss";

function HomePage() {
  const [announcements] = useState([
    { title: "Enrollment Open", date: "2025-10-15" },
    { title: "New Laboratory Inauguration", date: "2025-10-18" },
    { title: "Library Renovation Completed", date: "2025-10-20" },
    { title: "Scholarship Applications", date: "2025-10-25" },
  ]);

  const [achievements] = useState([
    { title: "BSIT Students Won Hackathon", date: "2025-09-30" },
    { title: "Faculty Award: Dr. Mark Villanueva", date: "2025-10-05" },
    { title: "CSP Department Ranked #1 in Region", date: "2025-10-10" },
  ]);

  const [events] = useState([
    { title: "Orientation Program", date: "2025-10-20", location: "Main Hall" },
    { title: "Tech Fest", date: "2025-11-05", location: "Labs" },
    { title: "Alumni Meetup", date: "2025-11-15", location: "Auditorium" },
  ]);

  const [testimonials] = useState([
    { name: "Jane Dela Cruz", text: "Jaypee Uni transformed my career!" },
    { name: "Mark Santos", text: "Amazing faculty and resources." },
    { name: "Alice Reyes", text: "A modern learning environment." },
  ]);

  const quickLinks = [
    "Faculty",
    "Students",
    "Courses",
    "Departments",
    "Reports",
    "Profile",
    "Library",
    "Events",
  ];

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>Welcome to Jaypee University</h1>
          <p>Empowering Knowledge. Shaping the Future.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-stats">
        <div className="stat-card">
          <h2>1200+</h2>
          <p>Enrolled Students</p>
        </div>
        <div className="stat-card">
          <h2>85+</h2>
          <p>Faculty Members</p>
        </div>
        <div className="stat-card">
          <h2>10</h2>
          <p>Departments</p>
        </div>
        <div className="stat-card">
          <h2>50+</h2>
          <p>Courses Offered</p>
        </div>
      </section>

      {/* Announcements */}
      <section className="section-announcements">
        <h3>Latest Announcements</h3>
        <ul>
          {announcements.map((a, idx) => (
            <li key={idx}>
              <strong>{a.title}</strong>
              <span>{new Date(a.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Achievements */}
      <section className="section-achievements">
        <h3>Recent Achievements</h3>
        <ul>
          {achievements.map((ach, idx) => (
            <li key={idx}>
              <strong>{ach.title}</strong>
              <span>{new Date(ach.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Events */}
      <section className="section-events">
        <h3>Upcoming Events</h3>
        <ul>
          {events.map((e, idx) => (
            <li key={idx}>
              <strong>{e.title}</strong>
              <span>
                {new Date(e.date).toLocaleDateString()} @ {e.location}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick Links */}
      <section className="section-quick-links">
        <h3>Quick Links</h3>
        <div className="links-grid">
          {quickLinks.map((link, idx) => (
            <button key={idx}>{link}</button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-testimonials">
        <h3>What Students Say</h3>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <p>"{t.text}"</p>
              <span>- {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2025 Jaypee University. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
