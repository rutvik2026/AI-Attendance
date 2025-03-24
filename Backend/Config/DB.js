import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const DB=async()=>{
   try {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("MongoDb Connected");
   } catch (error) {
    console.log("error in mongoDb Connection");
   }
}
export default DB;