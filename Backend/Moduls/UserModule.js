
import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  lectures: [
    {
      subject: {
        type: String,
      },
      teacher:{
        type:String,
      },
      student:[
        {
          name:String,
          rollNo:Number,
          inTime:String,
          outTime:String,
          present:Boolean,
        }
      ]
    },
  ],
});
const teacherSchema=new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
  },
   password:{
    type:String,
    required:true,
  },
  subject:{
    type:String,
    
  },
  classes:[{
    type:String,
  }]



});
const studentSchema=new mongoose.Schema({
    name:{
      type:String,
      required:true,
    },
    
    rollNo:{
      type:Number,
      required:true,
    },
    face:{
      type:String,
      
    },
    email:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true,
    },
    classes:{
      type:String,
    },
    classId:{
      type:String,
    }


})
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: {
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
  attendance: [attendanceSchema],
  uniqueId:{
    type:String,
  }
});
const adminSchema=new mongoose.Schema({
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
      id:{
        type:String,
      },
       name:{
        type:String,
        
       },
       classId:{
        type:String,
       }
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