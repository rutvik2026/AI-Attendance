import React, { useState } from "react";
import "./StudentHome.css";
import {  useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function StudentHome() {
  const navigate = useNavigate();
 const [show,setShow]=useState(false);
 const [uniqueId,setUniqueId]=useState();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleShowAttendance = () => {
    navigate("/studentattendence");
  };
  const addToClass=()=>{
    setShow(!show);
  }
  const handleGoToClass=async()=>{
    try {
      const token=sessionStorage.getItem("cust");
      const {id,role}=token ? JSON.parse(token):{};
      const res =await axios.post("/api/v1/user/addclass",{
          uniqueId:uniqueId,
          userId:id,
          role:role,
      });
      alert("Student add to class");
      console.log(res.data);
    } catch (error) {
      console.log("error in adding to class",error);
    }
  }
  return (
    <div>
      <nav className="navbar">
        <h1 className="m-2">Student Dashboard</h1>
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
        {show ? (
          <>
            <Form.Control
              type="number"
              placeholder="Enter UniqueId of Class"
              value={uniqueId}
              onChange={(e) => {
                setUniqueId(e.target.value);
              }}
            />
            <Button
              varient="primary"
              className="w-100 mt-3"
              onClick={handleGoToClass}
            >
              Go TO Class
            </Button>
          </>
        ) : (
          ""
        )}
        <Button varient="primary" className="w-100 mt-5" onClick={addToClass}>
          Add to Class
        </Button>
        <button className="show-attendance-btn" onClick={handleShowAttendance}>
          Show Attendance
        </button>
      </div>
    </div>
  );
}
