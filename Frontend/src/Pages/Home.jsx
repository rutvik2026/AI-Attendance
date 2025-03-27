import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [role, setRole] = useState();
  const [classes, setClasses] = useState([]);
  const [id, setId] = useState();
  const [className, setClassName] = useState(false);
  const [name, setName] = useState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [uniqueId, setUniqueId] = useState();
  const [count,setCount]=useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("cust");
    const parsedToken = token ? JSON.parse(token) : {};
    setId(parsedToken.id);
    setRole(parsedToken.role);

    const getClasses = async () => {
      try {
        const response = await axios.get("/api/v1/user/getclasses", {
          params: { userId: parsedToken.id, role: parsedToken.role },
        });
        setClasses(response.data);
      } catch (error) {
        console.error("Error getting classes", error);
      }
    };

    if (parsedToken.id) {
      getClasses();
    }
  }, [count]);

  const handleMakeClass = async () => {
    try {
      const result = await axios.post("/api/v1/user/makeclass", {
        name: name,
        adminId: id,
      });
      console.log(result.data);
      setCount(!count);
      setClassName(!className);
      alert("class maked successfully");
      
    } catch (error) {
      console.error("Error in making class", error);
    }
  };
  const handleAddClass = () => {
    console.log("frontend role and user id home", role, id);

    setClassName(!className);
  };
  const handleAttendance = (id) => {
    console.log("id",id);
    navigate("/attendance", { state: { classId: id } });
  };
  
  const addToClass = () => {
    setShow(!show);
  };
  const handleGoToClass = async () => {
    try {
      const token = sessionStorage.getItem("cust");
      const { id, role } = token ? JSON.parse(token) : {};
      const res = await axios.post("/api/v1/user/addclass", {
        uniqueId: uniqueId,
        userId: id,
        role: role,
      });
      setCount(!count);
      setShow(!show);
      alert("Teacher add to class");
      console.log(res.data);
    } catch (error) {
      console.log("error in adding to class", error);
    }
  };
  console.log("classes", classes);
  return (
    <Container className="d-flex justify-content-center flex-wrap mt-4">
      {role === "admin" || role === "teacher" ? (
        <div>
          <h1 className="text-center">Classes</h1>

          <Row className="fw-bold border-bottom pb-2">
            <Col xs={2}>ID</Col>
            <Col xs={6}>Name</Col>
          </Row>

          {Array.isArray(classes) && classes.length > 0 ? (
            classes.map((clas) => (
              <Row
                key={clas.uniqueId}
                onClick={() => {
                  handleAttendance(clas._id);
                }}
                className="py-2 border-bottom"
              >
                <Col xs={2}>{clas.uniqueId}</Col>
                <Col xs={6} className="ms-3">
                  {clas.name}
                </Col>
              </Row>
            ))
          ) : (
            <p className="text-muted">No classes available</p>
          )}

          {className ? (
            <>
              <Form.Control
                type="text"
                placeholder="Enter Class Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button
                variant="primary"
                className="mt-4 w-100"
                onClick={handleMakeClass}
              >
                Make Class
              </Button>
            </>
          ) : (
            ""
          )}
          {role === "admin" && (
            <Button
              variant="primary"
              className="mt-4 w-100"
              onClick={handleAddClass}
            >
              Add Class
            </Button>
          )}
          {role === "teacher" ? (
            <>
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
              <Button
                varient="primary"
                className="w-100 mt-5"
                onClick={addToClass}
              >
                Add to Class
              </Button>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        <p>No classes available</p>
      )}
    </Container>
  );
};
