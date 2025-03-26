import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const Attendance = () => {
  const location=useLocation();
  const classId=location.state ?.classId ||"";
  const [attendance,setAttendance]=useState([]);
  useEffect(()=>{
    const getAttendance=async()=>{
      try {
        const res = await axios.get("/api/v1/user/getattendance", {
          params: { q: classId },
        });
        setAttendance(res.data);
        console.log("Attendance",res.data);
      } catch (error) {
        console.log("error in geting Attentance",error);
      }
    }
    getAttendance();
  },[]);
  return (
    <div>
    {attendance.length >0 ? 
    ("")
    :("")}
    
    </div>
  )
}
