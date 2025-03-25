import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./LoginReg.css";

export default function Register() {
  const [role, setRole] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
  };

  const renderForm = () => {
    switch (role) {
      case 'Student':
        return (
          <form>
            <div className="mb-4 m-2">
              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="text" placeholder="Class" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="text" placeholder="Roll No" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="email" placeholder="Email Address" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="password" placeholder="Confirm Password" className="w-full border p-2 rounded" />
            </div>
            <button className="w-full bg-blue-900 text-white p-2 rounded ">Register as Student</button>
          </form>
        );

      case 'Admin':
      case 'Teacher':
        return (
          <form>
            <div className="mb-4 m-2">
              <input type="text" placeholder="Name" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="email" placeholder="Email Address" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 m-2">
              <input type="password" placeholder="Confirm Password" className="w-full border p-2 rounded" />
            </div>
            <button className="w-full bg-blue-900 text-white p-2 rounded m">Register as {role}</button>
          </form>
        );

      default:
        return <p class="mt-4 m-2">Please select a role to proceed with registration.</p>;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 login">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 m-2">Register as {role || '...'}</h1>

        {/* Role Selection Buttons */}
        <div className="mb-4 flex justify-around">
          <button
            className={`role-btn m-2 ${role === 'Admin' ? 'active' : ''}`}
            onClick={() => setRole('Admin')}
          >
            Admin
          </button>
          <button
            className={`role-btn m-1 ${role === 'Student' ? 'active' : ''}`}
            onClick={() => setRole('Student')}
          >
            Student
          </button>
          <button
            className={`role-btn m-1 ${role === 'Teacher' ? 'active' : ''}`}
            onClick={() => setRole('Teacher')}
          >
            Teacher
          </button>
        </div>

        {/* Dynamic Form Rendering */}
        {renderForm()}

        <p className="mt-4 m-2">Already have an account? <Link to="/login" className="text-blue-500">Login here</Link></p>
      </div>
    </div>
  );
}
