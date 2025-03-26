import React from "react";

import Login from "./Pages/Login.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/Registration.jsx";
import StudentHome from "./Pages/StudentHome.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./Pages/Home.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/home" element={<Home></Home>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
