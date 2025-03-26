import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginReg.css";
import axios from "axios";

export default function Register() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    profile: null,
    rollNo:"",
    email: "",
    class: "",
    role: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("classess", formData.class);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("rollNo",formData.rollNo);
      if (formData.profile) {
        formDataToSend.append("profile", formData.profile);
      }
        console.log("frontend",formDataToSend);
      const res = await axios.post("/api/v1/user/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token);
        alert("Register successfully");
        navigate("/");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.log("Error in handleRegister", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const renderForm = () => {
    switch (role) {
      case "Student":
        return (
          <form onSubmit={handleRegister}>
            <div className="mb-4 m-2">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="profile"
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="name"
                value={formData.name}
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="text"
                placeholder="Class"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="class"
                value={formData.class}
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="number"
                placeholder="Roll No"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="rollNo" // 🔥 Fixed: Changed from "roll" to "rollNo"
                value={formData.rollNo}
                required
              />
            </div>

            <div className="mb-4 m-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="email"
                value={formData.email}
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="password"
                value={formData.password}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-2 rounded l"
            >
              Register as Student
            </button>
          </form>
        );
      case "Admin":
      case "Teacher":
        return (
          <form onSubmit={handleRegister}>
            <div className="mb-4 m-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="name"
                value={formData.name}
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="email"
                value={formData.email}
                required
              />
            </div>
            <div className="mb-4 m-2">
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                name="password"
                value={formData.password}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-2 rounded l"
            >
              Register as {role}
            </button>
          </form>
        );
      default:
        return (
          <p className="mt-4 m-2">
            Please select a role to proceed with registration.
          </p>
        );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 login">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 m-2">
          Register as {role || "..."}
        </h1>
        <div className="mb-4 flex justify-around">
          <button
            className={`role-btn m-2 ${role === "Admin" ? "active" : ""}`}
            onClick={() => {
              setRole("Admin");
              setFormData((prevData) => ({
                ...prevData,
                role: "Admin",
              }));
            }}
          >
            Admin
          </button>
          <button
            className={`role-btn m-1 ${role === "Student" ? "active" : ""}`}
            onClick={() => {
              setRole("Student");
              setFormData((prevData) => ({
                ...prevData,
                role: "Student",
              }));
            }}
          >
            Student
          </button>
          <button
            className={`role-btn m-1 ${role === "Teacher" ? "active" : ""}`}
            onClick={() => {
              setRole("Teacher");
              setFormData((prevData) => ({
                ...prevData,
                role: "Teacher",
              }));
            }}
          >
            Teacher
          </button>
        </div>
        {renderForm()}
        <p className="mt-4 m-2">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
