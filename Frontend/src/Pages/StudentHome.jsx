import React from "react";
import "./StudentHome.css";
import { useNavigate } from "react-router-dom";

export default function StudentHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleShowAttendance = () => {
    navigate("/attendance");
  };

  return (
    <div>
  
      <nav className="navbar">
        <h1 class="m-2">Student Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </nav>

     
      <div className="content">
        <h2>Welcome to the Student Dashboard</h2>
        <p>
          You can check your attendance overview or view subject-wise
          attendance.
        </p>
        <button className="show-attendance-btn" onClick={handleShowAttendance}>
          Show Attendance
        </button>
      </div>
    </div>
  );
}
