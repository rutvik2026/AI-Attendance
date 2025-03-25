import express from "express";
import multer from "multer";
import { addClassController, getAttendanceController, getClasses, getSearchClassController, loginController, makeClassController, registerController } from "../Controllers/Controller.js";

const router=express.Router();
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    },

});
const upload=multer({storage})
router.post("/register",upload.single("profile"),registerController);
router.post("/login",loginController);
router.post("/makeClasss",makeClassController);
router.post("addClass",addClassController);
router.get("/getsearchclass",getSearchClassController);
router.get("/getClass",getClasses);
router.get("/getAttendance",getAttendanceController);
export default router;