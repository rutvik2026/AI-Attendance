import cloudinary from "cloudinary";

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