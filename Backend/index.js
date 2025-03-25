import express from "express"
import cors from "cors"
import DB from "./Config/DB.js";
import router from "./UserRoute/UserRoute.js";
const app=express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    Credential: true,
  })
);
DB();
app.use("/api/v1/user",router)
app.listen(3000,(req,res)=>{
        console.log("Server is running on 3000...");
})