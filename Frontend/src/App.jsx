import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Registration.jsx";
import StudentHome from "./Pages/StudentHome.jsx";
import { Home } from "./Pages/Home.jsx";
import { Attendance } from "./Pages/Attendance.jsx";
import { StudentAttendance } from "./Pages/StudentAttendance.jsx";
import Protected from "./Components/Protected.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Protected2 from "./Components/Protected2.jsx";
import PublicRoute from "./Components/Protected2.jsx";
import StudentProtectedRoute from "./Components/StudentProtected.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute>
          <Login></Login>
        </PublicRoute>} />
        <Route path="/register" element={<PublicRoute>
          <Register></Register>
        </PublicRoute>} />
        <Route
          path="/studenthome"
          element={
           <StudentProtectedRoute>
            <StudentHome></StudentHome>
           </StudentProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/attendance"
          element={
            <Protected>
              <Attendance />
            </Protected>
          }
        />
        <Route
          path="/studentattendence"
          element={
            <StudentProtectedRoute>
              <StudentAttendance></StudentAttendance>
            </StudentProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
