import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Spinner } from "react-bootstrap";

export const Attendance = () => {
  const location = useLocation();
  const classId = location.state?.classId || "";

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const res = await axios.get("/api/v1/user/getattendance", {
          params: { classId: classId },
        });
        setAttendance(res.data);
        console.log("Attendance:", res.data);
      } catch (error) {
        console.log("Error in getting attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) getAttendance();
  }, [classId]);

  return (
    <div className="container mt-4">
      <h1 className="d-flex justify-content-center mb-3">Attendance</h1>

     
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

    
      {!loading && attendance.length > 0 ? (
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Present</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) =>
              record.lectures.map((lecture, i) =>
                lecture.student.map((student, j) => (
                  <tr key={`${index}-${i}-${j}`}>
                    <td>{record.date.slice(0, 10)}</td>
                    <td>{lecture.subject}</td>
                    <td>{lecture.teacher}</td>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.inTime}</td>
                    <td>{student.outTime}</td>
                    <td>{student.present ? "P" : "A"}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </Table>
      ) : (
        !loading && (
          <div className="text-center">
            <p>No attendance records found</p>
          </div>
        )
      )}
    </div>
  );
};
