// components/Login.js
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!firstName || !studentId) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    onLogin({ firstName, studentId });
  };

  return (
    <div className="login-container">
      <h2>welcome!</h2>
      <div className="login-form">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />

        <label htmlFor="studentId">Student ID / Staff Username</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter your student ID / staff username"
        />

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleLogin}>Go</button>
      </div>
    </div>
  );
}
