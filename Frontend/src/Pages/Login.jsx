import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginReg.css";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData,setFormData]=useState({
    email:"",
    password:"",

  });

  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
        const res=await axios.post("/api/v1/user/login",formData);
        console.log(res.data);
        if(res.data.success){
            const {token,cust}=res.data;
            sessionStorage.setItem("token", JSON.stringify(token));;
            sessionStorage.setItem("cust", JSON.stringify(cust));
          
            if(cust.role==="student"){
                navigate("/studenthome");
            }else{
                navigate("/home");
            }
            
        }else{
            alert("login failled");
        }
    } catch (error) {
        console.log("error in login",error);
    }
  };
  const handleChange=(e)=>{
     const { name, value } = e.target;
     setFormData({
       ...formData,
       [name]: value,
     });
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 login">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="form-toggle">
          <button className="active">Login</button>
          <button onClick={() => navigate("/register")}>Signup</button>
        </div>
        <h1 className="text-2xl font-bold mb-4 m-2">Login Form</h1>
        <form>
          <div className="mb-4 m-2">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4 m-2">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="text-right mb-4 m-2">
            <a href="#" className="text-blue-500">
              Forgot password?
            </a>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-900 text-white p-2 rounded l"
          >
            Login
          </button>
        </form>
        <p className="mt-4 m-2">
          Not a member?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Signup now
          </span>
        </p>
      </div>
    </div>
  );
}
