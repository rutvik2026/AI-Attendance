
import mongoose from "mongoose";
import mongosse from "mongoose";
const teacherSchema=new mongoose.Schema({
    name:String,
    phone:String,
    subject:String,

});
const studentSchema=new mongoose.Schema({
    name:String,
    class:String,
    rollno:Number,
    face:String,

})
const classSchema = new mongosse.Schema({
  name: { type: String, required: true },
  admin: {
    type: String,
    required: true,
  },
  teacher: [
    {
      type: String,
    },
  ],
  students: [
    {
      type: String,
    },
  ],
  attendance: [
    {
      student: {
        type:String,
      },
      teacher: {
        type: String,
      },
      present: Boolean,
    },
  ],
});
const adminSchema=new mongosse.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    classes:[{
        type:String,
    }],


})
 const adminModule=new mongoose.model("Admin",adminSchema);
 const studentModule=new mongoose.model("Student",studentSchema);
 const teacherModule=new mongoose.model("teacher",teacherSchema);
 const classModule=new mongoose.model("Class",classSchema);
  export {
    adminModule,
    studentModule,
    teacherModule,
    classModule,
  }