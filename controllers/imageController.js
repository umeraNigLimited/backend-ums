// import db from "../dbModel/db.js";
// import { uploadToCloudiary } from "../utlities/emails/storage/cloudinary.js";

// export const getImage = async (req, res) => {
//   const staff_id = req.user;

//   try {
//     const { rows } = await db.query(
//       "SELECT * FROM staff_images WHERE staff_id = $1",
//       [staff_id]
//     );

//     if (rows.length > 0) {
//       return res
//         .status(200)
//         .json({ message: "Successfully Retrieved Data", data: rows });
//     }

//     return res.status(404).json({ message: "No Image found" });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: err.message });
//   }
// };

// export const addImage = async (req, res) => {
//   const staff_id = req.user;
//   const formData = req.body;

//   try {
//     const uploadResult = await uploadToCloudiary(formData);
//     const image_url = uploadResult.secure_url;
//     const description = formData.description;
//     const public_id = uploadResult.publicId;

//     const { rows } = await db.query(
//       "INSERT INTO staff_images (staff_id, image_url, description, public_id) VALUES ($1, $2, $3, $4) RETURNING *",
//       [staff_id, image_url, description, public_id]
//     );

//     if (rows.length > 0) {
//       return res
//         .status(201)
//         .json({ message: "Successfully Added Data", data: rows[0] });
//     }

//     throw new Error("Failed to Add Image");
//   } catch (err) {
//     console.error(`Error adding image for user ${staff_id}:`, err);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

// export const updateImage = async (req, res) => {
//   const staff_id = req.user;
//   const { id, image_url, description } = req.body;

//   try {
//     const { rows } = await db.query(
//       "UPDATE staff_images SET image_url = $1, description = $2, upload_date = CURRENT_TIMESTAMP WHERE id =$3 AND staff_id = $4 RETURNING *",
//       [image_url, description, id, staff_id]
//     );

//     if (rows.length > 0) {
//       return res
//         .status(200)
//         .json({ message: "Successfully Updated Data", data: rows[0] });
//     }

//     return res.status(400).json({ message: "Failed to Update Data" });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: err.message });
//   }
// };
