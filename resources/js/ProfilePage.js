import React from "react";
import "../sass/profile.scss";

function ProfilePage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Admin Profile</h1>
        <p>Manage your account settings and preferences.</p>
      </header>

      <section className="page-content profile-section">
        <div className="profile-card">
          <img
            src="https://via.placeholder.com/100"
            alt="Admin"
            className="profile-avatar"
          />
          <h2>Admin Name</h2>
          <p>System Administrator</p>
        </div>

        <form className="profile-form">
          <label>
            Name:
            <input type="text" defaultValue="Admin Name" />
          </label>
          <label>
            Email:
            <input type="email" defaultValue="admin@example.com" />
          </label>
          <label>
            Password:
            <input type="password" placeholder="••••••••" />
          </label>
          <button className="save-btn">Save Changes</button>
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
