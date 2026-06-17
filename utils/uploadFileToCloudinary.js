import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileToCloudinary = async (file) => {
  try {
    if (!file) return null;

    const filePath = file.tempFilePath || file.path;
    if (!filePath) {
      throw new Error("No temporary file path available for upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "uploads",
    });

    return result.secure_url || result.url;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadFileToCloudinary;
