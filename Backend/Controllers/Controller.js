import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs"
import path from "path";
import axios from "axios"
import { spawn } from "child_process";
import {
  adminModule,
  classModule,
  studentModule,
  teacherModule,
} from "../Moduls/UserModule.js";
import { uploadOnCloudinary } from "../Utill/Cloudinary.js";

const registerController = async (req, res) => {
  try {
    const { role, name, email, password, subject, rollNo, classess ,face} = req.body;
    if (!name || !email || !password) {
      return res.status(201).json({ message: "required all fields", success: false });
    }
    if (role === "Teacher") {
      const existingTeacher = await teacherModule.findOne({ email: email });
      if (existingTeacher) {
        return res.status(200).json({ message: "user is already exist", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const teacher = new teacherModule(req.body);
      await teacher.save();
      res.status(200).json({ message: "teacher is registered successfully", success: true });
    } else if (role === "Student") {
      console.log("req.file", req.file);
      if (!rollNo || !classess || !req.file) {
        return res.status(400).json({ message: "Missing required fields", success: false });
      }
      const existingStudent = await studentModule.findOne({ email: email });
      if (existingStudent) {
        return res.status(200).json({ message: "user is already exist", success: false });
      }

      const profileLocalPath = req.file?.path;
      const profileUrl = await uploadOnCloudinary(profileLocalPath);
      req.body.profile = profileUrl;

      // Run Python script for face data extraction
      const pythonProcess = spawn('python', ['Script/Convert_Image.py', profileLocalPath]);
      let faceData = '';

      pythonProcess.stdout.on('data', (data) => {
        faceData += data;
      });

      pythonProcess.on('close', async (code) => {
        if (code === 0) {
          req.body.face = Buffer.from(faceData, 'base64');

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          req.body.password = hashedPassword;
          const newStudent = new studentModule(req.body);
          await newStudent.save();
          res.status(200).json({ message: "student registered successfully", success: true });
        } else {
          res.status(502).json({ message: "Face extraction failed", success: false });
        }
      });
    } else if (role === "Admin") {
      const existingAdmin = await adminModule.findOne({ email: email });
      if (existingAdmin) {
        return res.status(201).json({ message: "user already exist", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newAdmin = new adminModule(req.body);
      await newAdmin.save();
      res.status(200).json({ message: "admin registered successfully", success: true });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    console.log("Error in registerController", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const loginController = async (req, res) => {
  try {
    console.log("req.body1",req.body.email);
    
    const teacher = await teacherModule.findOne({
      email: req.body.email,
    });
    const student = await studentModule.findOne({
      email: req.body.email,
    });
    const admin = await adminModule.findOne({
      email: req.body.email,
    });
    console.log("admin student teacher",admin,student,teacher);
    if (!teacher && !student && !admin) {
     return res.status(201).json({ message: "user not exist1 ", success: false });
    }
    if (teacher) {
      console.log("teacher",teacher);
      const isValid = await bcrypt.compare(req.body.password, teacher.password);
      if (!isValid) {
       return res
          .status(400)
          .json({ message: "Email or Password is incorrect ", success: false });
      } else {
        const token = jwt.sign(
          { id:teacher._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
       return res.status(200).json({
          message: "Login sucessfully as a teacher ",
          success: true,
          token,
          cust:{
            id:teacher._id,
            role:"teacher",
            
          }
        });
      }
    }else if(student){
      console.log("student", student);
        const isValid = await bcrypt.compare(req.body.password,student.password);
        if(!isValid){
           return res
              .status(400)
              .json({
                message: "Email or Password is incorrect ",
                success: false,
              });
        }else{
            const token = jwt.sign(
              { id: student._id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );
           return res.status(200).json({
              message: "Login sucessfully as a student ",
              success: true,
              token,
              cust:{
                id:student._id,
                role:"student",
                rollNo:student.rollNo,
                classId:student.classId,
              }
            });
        }
    } else{
             const isValid = await bcrypt.compare(
               req.body.password,
               admin.password
             );
             if (!isValid) {
              return res.status(400).json({
                 message: "Email or Password is incorrect ",
                 success: false,
               });
             }else{
              const token = jwt.sign(
                { id: admin._id, role: admin },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1d",
                }
              );
               return res.status(200).json({
                message: "Login sucessfully as a admin ",
                success: true,
                token,
                cust:{
                  id:admin._id,
                  role:"admin",
                }
              });
             }
        }
    
  } catch (error) {
    console.log("error in loginController ", error);
    res.status(500).json({ mesaage: "error in loginController" ,success:false});
  }
};
const makeClassController=async(req,res)=>{
    try {
      const {adminId,name}=req.body;
      const admin = await adminModule.findOne({
        _id: adminId,
      });
      if(!admin){
         res.status(400).json({ mesaage: "admin not found",success:false });
      };
      const uniqueId = Date.now().toString().slice(-4);
      const newClassData={
        adminId:adminId,
        name:name,
        uniqueId:uniqueId,
      }
      const newClass = new classModule(newClassData);
      const result=await newClass.save();
      
       admin.classes.push({
         id: result._id,
         name: result.name,
         classId: uniqueId,
       });
       const rel=await admin.save();
       res.status(200).json({
        message:"class make sucessfully",
        success:true,
       });

    } catch (error) {
      console.log("error in makeClassController",error);
      res.status(500).json({ mesaage: "error in makeClassController" ,success:false});
    }
}

const addClassController=async(req,res)=>{
    try {
      const {role,userId,uniqueId}=req.body;
      console.log("req.bory in add classCntr",req.body);
        if(!role || !userId || !uniqueId){
          res.status(400).json({ mesaage: "role or userId or classId is required",success:false });
        };
        const classes=await classModule.findOne({uniqueId:uniqueId});
        
        if(role==="student"){
         if (!classes.students.includes(userId)) {
           
           classes.students.push(userId); 
           await classes.save();
           console.log("User added to class successfully.");
         } else {
           console.log("User already exists in this class.");
         }

          const stud=await studentModule.findOne({_id:userId});
          stud.classId = classes._id;
          stud.save();
         return res.status(200).json({ mesaage: "student add to class" ,success:true});
        }else{
          if (!classes.teacher.includes(userId)) {
            classes.teacher.push(userId);
            await classes.save();
          }

          const tech = await teacherModule.findOne({ _id: userId });

          if (!tech) {
            console.log("Teacher not found!");
          } else {
            console.log("Teacher found:", tech);

            if (!tech.classes.includes(classes._id)) {
              tech.classes.push(classes._id);
              await tech.save();
              console.log("Class added to teacher successfully.");
            } else {
              console.log("Class already assigned to teacher.");
            }
          }

         return res.status(200).json({ mesaage: "teacher add to class" });
        }
        
    } catch (error) {
      console.log("error in addClassController",error);
      res.status(500).json({ mesaage: "error in addClassController" });
    }
};

const getClasses=async(req,res)=>{
  try {
    const {role,userId}=req.query;
    console.log("role and userId from getClssCntr",role,userId);
    if(role==="admin"){
      const admin=await adminModule.findOne({_id:userId});
    const fd = await Promise.all(
      admin.classes.map(async (cals) => {
        const cl = await classModule.findOne({ _id: cals.id });
        console.log("Found class:", cl);
        return cl;
      })
    );
    res.status(200).json(fd);
   }else{
      const teacher=await teacherModule.findOne({_id:userId});
     
      const fd = await Promise.all(
        teacher.classes.map(async (cals) => {
          const cl = await classModule.findOne({ _id: cals });
          console.log("Found class:", cl);
          return cl;
        })
      );
      res.status(200).json(fd);
    }
  } catch (error) {
    console.log("error in getClassesController ",error);
    res
      .status(500)
      .json({ message: "error in getAttendanceController", sucess: false });
  }
};
const getAttendanceController=async(req,res)=>{
    try {
      const {classId}=req.query;
      console.log("classId",classId);
      const classes = await classModule.findOne({ _id: classId });

      if (!classes) {
        return res.status(400).json({ message: "Class not found" });
      }

      res.status(200).json(classes.attendance);

    } catch (error) {
      console.log("error in getAttendanceController",error);
      res.status(500).json({message:"error in getAttendanceController",sucess:false})
    }
}

const getStudentAttendanceController=async(req,res)=>{
 const { classId, rollNo } = req.query;
 console.log("backend", req.query);

 try {
   const classes = await classModule.findOne({ _id: classId });

   if (!classes) {
     return res.status(400).json({ message: "Class not found" });
   }

   // Ensure attendance exists and is an array
   if (!Array.isArray(classes.attendance)) {
     return res.status(400).json({ message: "Attendance data not available" });
   }

   // Proper filter function
   const attendance = classes.attendance.filter(
     (att) => att.student.rollNo === rollNo
   );

   return res.status(200).json(attendance);
 } catch (error) {
   console.log("error in getStudentAttendance", error);
   res.status(500).json({ message: "error in getStudentAttendance" });
 }
}

const compareFaces = (face1, face2) => {
  console.log('Comparing faces...');
  return Math.random() < 0.5; // Placeholder for testing
};

const startAttendanceController = async (req, res) => {
  try {
    const { uniqueId,teacherId } = req.body;
    const classData = await classModule.findOne({ uniqueId });
    const teacher = await teacherModule.findOne({
      _id:teacherId
    });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const studentIds = classData.students;
    if (!studentIds.length) {
      return res.status(404).json({ message: 'No students found' });
    }
      const tt={
        teacherName:teacher.name,
        subject:teacher.subject,
      }
    const currentDate = new Date();
    const attendanceRecord = {
      date: currentDate,
      lectures: [{
        tt,
        student: [],
      }],
    };

    // Fetch detected faces from the API
    const response = await axios.get('http://127.0.0.1:5001/detect_faces');
    let detectedFaces = response.data.faces.map(face => Buffer.from(face, 'base64'));
    console.log('Detected faces:', detectedFaces);

    // Fetch student data
    const students = await studentModule.find({ _id: { $in: studentIds } });

    students.forEach(student => {
      if (!student.face) {
        console.warn(`Face data not available for student: ${student.name}`);
        return;
      }

      const studentFace = Buffer.from(student.face, 'base64');

      // Compare detected faces with student face
      const isDetected = detectedFaces.some(face => compareFaces(face, studentFace));

      if (isDetected) {
        attendanceRecord.lectures[0].student.push({
          name: student.name,
          rollNo: student.rollNo,
          inTime: currentDate.toLocaleTimeString(),
          outTime: '',
          present: true,
        });
        console.log(`Attendance marked for: ${student.name}`);
      }
    });

    classData.attendance.push(attendanceRecord);
    await classData.save();

    res.status(200).json({ message: 'Attendance marked for detected students', attendanceRecord });

  } catch (error) {
    console.error('Error in startAttendanceController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export { 
    registerController ,
    loginController,
    makeClassController,
    addClassController,
    startAttendanceController,
    getClasses,
    getAttendanceController,
    getStudentAttendanceController,
};
