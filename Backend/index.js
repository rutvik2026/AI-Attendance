import express from "express"
import cors from "cors"
import DB from "./Config/DB.js";
const app=express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    Credential: true,
  })
);
DB();
app.listen(3000,(req,res)=>{
        console.log("Server is running on 3000...");
})