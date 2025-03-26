import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs"
import {
  adminModule,
  classModule,
  studentModule,
  teacherModule,
} from "../Moduls/UserModule.js";
import { uploadOnCloudinary } from "../Utill/Cloudinary.js";
const registerController = async (req, res) => {
  try {
   
    const { role, name, email, password, subject, rollNo, classess } = req.body;
    if (!name || !email || !password) {
      return res.status(201).json({ message: "required all fields", success: false });
    }
    if (role === "Teacher") {
     
      const existingTeacher = await teacherModule.findOne({
        email: email,
      });
      if (existingTeacher) {
        return res
          .status(200)
          .jason({ mesaage: "user is already exist", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const teacher = new teacherModule(req.body);
      const result = await teacher.save();
      res.status(200).json({
        message: "teaches is registered successfully",
        success: true,
      });
    } else if (role === "Student") {
      console.log("req.file",req.file);
      if (!rollNo || !classess || !req.file) {
        return res
          .status(400)
          .json({ mesaage: "user is already exist", success: false });
      }
         const existingStudent = await studentModule.findOne({
           email: email,
         });
      if (existingStudent) {
        return res
          .status(200)
          .json({ mesaage: "user is already exist", success: false });
      }
      const profileLocalPath = req.file?.path;
      const profileUrl = await uploadOnCloudinary(profileLocalPath);
      req.body.profile = profileUrl;
     
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newStudent = new studentModule(req.body);
      const result = await newStudent.save();
      res
        .status(200)
        .json({ message: "student registered successfully", success: true });
    } else if (role === "Admin") {
      const existingAdmin = await adminModule.findOne({
        email: email,
      });
      if (existingAdmin) {
        return res
          .status(201)
          .json({ message: "user already exist", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newAdmin = new adminModule(req.body);
      const result = await newAdmin.save();
      res.status(200).json({
        message: "admin register successfully",
        success: true,
      });
    } else {
      return res.status(400).json({ message: "Invelide role" });
    }
  } catch (error) {
    console.log("Error in registerControlle", error);
    res.status(500).json({ message: "Intrnal server error", success: false });
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
          { id: teacher._id },
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
            const token = jwt.sign({id:student._id},{
                expiresIn:"1d",
            });
           return res.status(200).json({
              message: "Login sucessfully as a student ",
              success: true,
              token,
              cust:{
                id:student._id,
                role:"student",
                rollNo:student.rollNo,
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
      const {role,userId,classId}=req.body;
        if(!role || !userId || !classId){
          res.status(400).json({ mesaage: "role or userId or classId is required",success:false });
        };
        const classes=await classModule({_id:classId});
        
        if(role==="student"){
          classes.students.push(userId);
          await classes.save();
          const stud=await studentModule.findOne({_id:userId});
          stud.classes(classId);
          res.status(200).json({ mesaage: "student add to class" ,success:true});
        }else{
          classes.teacher.push(userId);
          await classes.save();
          const tech=await teacherModule.findOne({_id:userId});
          tech.classes.push(classId);
          res.status(200).json({ mesaage: "teacher add to class" });
        }
        
    } catch (error) {
      console.log("error in addClassController",error);
      res.status(500).json({ mesaage: "error in addClassController" });
    }
};
const getSearchClassController=async(rea,res)=>{
  try {
    const {uniqueId}=req.query.q;
    const classes=await classModule.findOne({uniqueId:uniqueId});
    res.status(200).json(classes);
  } catch (error) {
    console.log("error in searchClassCOntroller",error);
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
      teacher.classes.map(async(cals)=>{
        const cl=await classModule.findOne({uniqueId:cals.uniqueId});
        res.status(200).json(cl);
      })
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
      const {classId}=req.query.q;
      const classes=await classModule.findOne({_id:classId});
      res.status(200).json(classes.attendance);
    } catch (error) {
      console.log("error in getAttendanceController",error);
      res.status(500).json({message:"error in getAttendanceController",sucess:false})
    }
}

const getStudentAttendanceController=async(req,res)=>{
  try {
    const { classId, rollNo } = req.query.q;
    const classes = await classModule.findOne({ _id: classId });
    if (!classes) {
      res
        .status(400)
        .json({ message: "Error in getStudentAtendanceController" });
    }
    const attendance = await classes.attendance.filter(
      attendance.student.rollNo === rollNo
    );
    res.status(200).json({ message: "getAttendance sucessfully" });
  } catch (error) {
    console.log("error in getStudentAttendance",error);
    res.status(500).json({message:"error in getStudentAttendance"});
  }
}
export { 
    registerController ,
    loginController,
    makeClassController,
    addClassController,
    getSearchClassController,
    getClasses,
    getAttendanceController,
    getStudentAttendanceController,
};
