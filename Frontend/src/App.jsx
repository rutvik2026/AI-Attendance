import React from 'react';

import Login from './Pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register.jsx';
import StudentHome from './Pages/StudentHome';
import "bootstrap/dist/css/bootstrap.min.css";



function App() {
  return (
    <div>
      
     <BrowserRouter>
       <Routes>
        
          <Route path="/" element={<Login />} />
          <Route path='/register'element={<Register></Register>}/>
          <Route path="/student-home" element={<StudentHome />} />
          
    
       </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
