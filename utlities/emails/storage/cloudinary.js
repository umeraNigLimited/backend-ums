import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloudiary = async (image) => {
  try {
    // Generate a unique public ID for each upload
    const publicId = `profile_pic_${Date.now()}`;

    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(image, {
      public_id: publicId,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizedUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    return { secure_url: uploadResult.secure_url, optimizedUrl, publicId };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};
