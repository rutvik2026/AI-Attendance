import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  adminModule,
  classModule,
  studentModule,
  teacherModule,
} from "../Moduls/UserModule.js";
import { uploadOnCloudinary } from "../Utill/Cloudinary.js";
const registerController = async (req, res) => {
  try {
    const { role, name, email, password, subject, rollNo, classes } = req.body;
    if (!name || !email || !password) {
      res.status(201).json({ message: "required all fields", success: false });
    }
    if (role === "teacher") {
      if (!subject) {
        res
          .status(201)
          .json({ message: "required all fields", success: false });
      }
      const existingTeacher = await teacherModule.findOne({
        email: email,
      });
      if (existingTeacher) {
        res
          .status(200)
          .jason({ mesaage: "user is already exist", sucess: false });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const teacher = new teacherModule(req.body);
      const result = await teacher.save();
      res.status(200).json({
        message: "teaches is registered successfully",
        sucess: true,
      });
    } else if (role === "student") {
      if (!rollNo || !classes || !req.file) {
        res
          .status(200)
          .jason({ mesaage: "user is already exist", sucess: false });
      }

      if (existingStudent) {
        res
          .status(200)
          .jason({ mesaage: "user is already exist", sucess: false });
      }
      const profileLocalPath = req.file?.path;
      const profileUrl = await uploadOnCloudinary(profileLocalPath);
      req.body.profile = profileUrl;
      const existingStudent = await studentModule.findOne({
        email: email,
      });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newStudent = new studentModule(req.body);
      const result = await newStudent.save();
      res
        .status(200)
        .json({ message: "student registered successfully", sucess: true });
    } else {
      const existingAdmin = await adminModule.findOne({
        email: email,
      });
      if (existingAdmin) {
        res.status(201).json({ message: "user already exist", success: false });
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
    }
  } catch (error) {
    console.log("Error in registerControlle", error);
    res.status(500).json({ message: "Intrnal server error", success: false });
  }
};
const loginController = async (req, res) => {
  try {
    const teacher = await teacherModule.findOne({
      email: req.body.email,
    });
    const student = await studentModule.findOne({
      email: req.body.email,
    });
    const admin = await adminModule.findOne({
      email: req.body.email,
    });
    if (!teacher || !student || !admin) {
      res.status(400).json({ message: "user not exist ", sucess: false });
    }
    if (teacher) {
      const isValid = await bcrypt.compare(req.body.password, teacher.password);
      if (!isValid) {
        res
          .status(400)
          .json({ message: "Email or Password is incorrect ", sucess: false });
      }
    } else {
      const token = jwt.sign(
        { id: teacher.id, role: teacher },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res
        .status(200)
        .json({
          message: "Login sucessfully as a teacher ",
          sucess: true,
          token,
        });
    }
    if(student){
        const isValid = await bcrypt.compare(req.body.password,student.password);
        if(!isValid){
            res
              .status(400)
              .json({
                message: "Email or Password is incorrect ",
                sucess: false,
              });
        }else{
            const token = jwt.sign({id:student.id,role:student,rollNo:student.rollNo},{
                expiresIn:"1d",
            });
            res.status(200).json({
              message: "Login sucessfully as a student ",
              sucess: true,
              token,
            });
        }
        if(!admin){
             res.status(400).json({
               message: "Email or Password is incorrect ",
               sucess: false,
             });
        }else{
             const token = jwt.sign({id:student.id,role:admin},{
                expiresIn:"1d",
            });
            res.status(200).json({
              message: "Login sucessfully as a admin ",
              sucess: true,
              token,
            });
        }
    }
  } catch (error) {
    console.log("error in loginController ", error);
    res.status(500).json({ mesaage: "error in loginController" });
  }
};
const makeClassController=async(req,res)=>{
    try {
      const {adminId,name}=req.body;
      const admin = await adminModule.findOne({
        _id: adminId,
      });
      if(!admin){
         res.status(400).json({ mesaage: "admin not found" });
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
        sucess:true,
       });

    } catch (error) {
      console.log("error in makeClassController",error);
      res.status(500).json({ mesaage: "error in makeClassController" });
    }
}

const addClassController=async(req,res)=>{
    try {
      const {role,userId,classId}=req.body;
        if(!role || !userId || !classId){
          res.status(400).json({ mesaage: "role or userId or classId is required" });
        };
        const classes=await classModule({_id:classId});
        
        if(role==="student"){
          classes.students.push(userId);
          await classes.save();
          const stud=await studentModule.findOne({_id:userId});
          stud.classes(classId);
          res.status(200).json({ mesaage: "student add to class" });
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
    const {role,userId}=req.query.q;
    if(role==="admin"){
      const admin=await adminModule.findOne({_id:userId});
      admin.classes.map(async(cals)=>{
          const cl=await classModule.findOne({uniqueId:cals.uniqueId});
          res.status(200).json(cl);
      })
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
