import express from "express";
import {  exec  } from "child_process";
import multer from "multer";
import { addClassController, getAttendanceController, getClasses, getStudentAttendanceController, loginController, makeClassController, registerController, startAttendanceController } from "../Controllers/Controller.js";

const router=express.Router();
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"Uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    },

});
const upload=multer({storage})
router.post("/register",upload.single("profile"),registerController);
router.post("/login",loginController);
router.post("/makeclass",makeClassController);
router.post("/addclass",addClassController);
router.post("/startattendance",startAttendanceController);
router.get("/getclasses",getClasses);
router.get("/getattendance",getAttendanceController);
router.get("/getstudentAttendance",getStudentAttendanceController);

router.get('/detect_faces', (req, res) => {
    // Run the Python script
    exec('Script/Detect_Face.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }
      if (stderr) {
        console.error(`Python stderr: ${stderr}`);
        return res.status(500).json({ error: stderr });
      }
      console.log(`Python output: ${stdout}`);
      try {
        const faceData = JSON.parse(stdout); // Assuming your Python prints JSON data
        res.json({ faces: faceData });
      } catch (parseError) {
        console.error("Error parsing Python output:", parseError);
        res.status(500).json({ error: "Invalid data from Python" });
      }
    });
  });
export default router;