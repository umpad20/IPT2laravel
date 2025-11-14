import React, { useState, useRef, useEffect } from "react";
import axios from "./axios";
import "../sass/profile.scss";

export default function ProfilePage() {
  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : null;
  const [user] = useState(storedUser || { email: '', role: 'ADMIN' });
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar (client-only). Stored as base64 string in localStorage under 'profile_avatar'.
  const [avatar, setAvatar] = useState(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('profile_avatar') : null;
    } catch (e) { return null; }
  });
  const fileRef = useRef(null);

  // Editing state
  const [editing, setEditing] = useState(false);
  const [editImage, setEditImage] = useState(null); // original dataURL for editor
  const [rotate, setRotate] = useState(0); // degrees: 0,90,180,270

  useEffect(() => {
    // keep avatar in sync if other tabs change it
    const onStorage = (e) => {
      if (e.key === 'profile_avatar') setAvatar(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleSelectAvatar = () => {
    fileRef.current && fileRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      // open editor with the selected image
      setEditImage(base64);
      setRotate(0);
      setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelEditing = () => {
    setEditImage(null);
    setRotate(0);
    setEditing(false);
    // reset file input value so re-selecting same file triggers change
    if (fileRef.current) fileRef.current.value = null;
  };

  const processAndSaveImage = async (dataUrl, rotation = 0, size = 256) => {
    // create image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // compute square crop size
        const minSide = Math.min(img.width, img.height);
        // canvas dimensions depend on rotation
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // after rotation, we will draw and then crop center square
        // for simplicity, draw rotated image to a temporary canvas at natural size
        const tmpCanvas = document.createElement('canvas');
        const tctx = tmpCanvas.getContext('2d');

        if (rotation % 180 === 0) {
          tmpCanvas.width = img.width;
          tmpCanvas.height = img.height;
        } else {
          tmpCanvas.width = img.height;
          tmpCanvas.height = img.width;
        }

        // apply rotation
        tctx.save();
        // move to center
        tctx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tctx.rotate((rotation * Math.PI) / 180);
        // draw image centered
        tctx.drawImage(img, -img.width / 2, -img.height / 2);
        tctx.restore();

        // compute center square crop from tmpCanvas
        const cropSize = Math.min(tmpCanvas.width, tmpCanvas.height);
        const sx = Math.floor((tmpCanvas.width - cropSize) / 2);
        const sy = Math.floor((tmpCanvas.height - cropSize) / 2);

        canvas.width = size;
        canvas.height = size;
        // draw cropped and resized
        ctx.drawImage(tmpCanvas, sx, sy, cropSize, cropSize, 0, 0, size, size);

        const outData = canvas.toDataURL('image/jpeg', 0.9);
        resolve(outData);
      };
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    });
  };

  const handleSaveEditedAvatar = async () => {
    try {
      const processed = await processAndSaveImage(editImage, rotate, 256);
      setAvatar(processed);
      try { localStorage.setItem('profile_avatar', processed); } catch (err) { /* ignore */ }
      handleCancelEditing();
    } catch (err) {
      console.error('Failed to process image', err);
      setMessage('Failed to process image');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    try { localStorage.removeItem('profile_avatar'); } catch (e) { }
  };

  const handlePasswordChange = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!newPassword || newPassword.length < 6) {
      setMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.');
      return;
    }
    try {
      if (!user || !user.email) throw new Error('No user email available');
      const response = await axios.post("/api/change-password", {
        email: user.email,
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setMessage(response.data.message || 'Password updated');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Something went wrong.';
      setMessage(msg);
    }
  };

  const initials = (user?.email || 'A').charAt(0).toUpperCase();

  return (
    <div className="profile-page single">
      <div className="profile-card single-card">
        <div className="profile-header" style={{alignItems: 'center', gap: 16}}>
          <div style={{display: 'flex', alignItems: 'center', gap:12}}>
              <div className="avatar-wrap" style={{width:72}}>
                {avatar ? (
                  <img src={avatar} alt="avatar" className="avatar" style={{width:72, height:72}} />
                ) : (
                  <div className="avatar" style={{width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center', background:'#eef2ff', color:'#1e3a8a', fontWeight:700, fontSize:24}}>{initials}</div>
                )}
                {/* If editing, show a small overlay preview of the edit image */}
                {editing && editImage && (
                  <div style={{position:'absolute', top:6, right:6, background:'rgba(0,0,0,0.6)', color:'#fff', padding:'4px 6px', borderRadius:6, fontSize:11}}>Editing</div>
                )}
              </div>
            <div>
              <h2 style={{margin:0}}>Admin Profile</h2>
              <div className="meta-row">
                <span className="role-badge">{(user.role || 'ADMIN').toUpperCase()}</span>
                <small className="muted" style={{marginLeft:8}}>{user.email}</small>
              </div>
            </div>
          </div>

          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{display:'none'}} />
            <button className="btn btn-ghost" type="button" onClick={handleSelectAvatar}>Change Photo</button>
            {avatar && <button className="btn btn-ghost" type="button" onClick={handleRemoveAvatar}>Remove</button>}
          </div>
        </div>

        {message && <div className="profile-message">{message}</div>}

        {/* Editor modal/controls (simple rotate + save) */}
        {editing && editImage && (
          <div className="profile-message" style={{display:'flex', gap:12, alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:80, height:80, overflow:'hidden', borderRadius:8, background:'#fff', border:'1px solid #eef2f6'}}>
                <img src={editImage} alt="edit-preview" style={{width:'100%', height:'100%', objectFit:'cover', transform:`rotate(${rotate}deg)`}} />
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-ghost" type="button" onClick={() => setRotate((r) => (r - 90 + 360) % 360)}>Rotate ◀</button>
                  <button className="btn btn-ghost" type="button" onClick={() => setRotate((r) => (r + 90) % 360)}>Rotate ▶</button>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-primary" type="button" onClick={handleSaveEditedAvatar}>Save Photo</button>
                  <button className="btn btn-ghost" type="button" onClick={handleCancelEditing}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="password-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange} className="password-form single">
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

            <label>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
