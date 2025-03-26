import cloudinary from "cloudinary";
import dotenv from "dotenv"
dotenv.config();
cloudinary.config({
  cloud_name: process.env.KEY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary=async(localFilePath)=>{
   try {
     const uploadResult =await cloudinary.uploader.upload(localFilePath, {
       resource_type: "auto",
       timeout: 60000,
       
     });
     return uploadResult.url;
   } catch (error) {
    console.log("error during upload on cloudinay",error);
    fs.unlinkSync(localFilePath);
    return null;
   }
}
export {
    uploadOnCloudinary,
}