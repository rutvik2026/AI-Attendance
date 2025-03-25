import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, Row } from 'react-bootstrap';
import axios from "axios"
export const Home = () => {
    const [role,setRole]=useState();
    const [classes,setClasses]=useState([]);
    const [id,setId]=useState();
    useEffect(()=>{
      const token = sessionStorage.getItem("token");
      const { rol, id } = token ? JSON.parse("token") : {};
      setId(id);
      setRole(rol);
       const getClasses=async()=>{
        try {
          const classes=await axios.get("/api/v1/user/getClasses",{
            q:id,
          });
          setClasses(classes.data);
        } catch (error) {
          console.log("error in geting classes",error);
        }
       }
       getClasses(); 
    },[])
    const handleMakeClass=async()=>{
      try {
        const result=await axios.get("/api/v1/user/makeclass",{
          q:id,
        });
        console.log(result.data);
      } catch (error) {
        console.log("error in making class",error);
      }
    }
  return (
    <div>
      {role === "admin" || role === "teacher" ? (
        <>
          <h1>Classes</h1>
          <Row>
            <col>Name</col>
          </Row>
          {classes.length > 0
            ? classes.map((clas) => {
                <Row>
                  <col>{clas.name}</col>
                </Row>;
              })
            : ""}
          {role==="admin"?(
            <Button verient="primary" onClick={handleMakeClass}>Make Class</Button>
            ):
            ("")

          }
        </>
      ) : (
        <p>No classes availlable</p>
      )}
    </div>
  );
}
