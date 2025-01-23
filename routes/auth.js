import express from "express";
import {
  creatingPassword,
  resetPassword,
  loginStaff,
  registerStaff,
  sendVerification,
} from "../controllers/authController.js";

//Express Router
const router = express.Router();
//Login Staffs Route

router.post("/login", loginStaff);

//Register Staffs Route
router.post("/register", registerStaff);

//Register Staffs Route
router.post("/verification", sendVerification);

//Register Staffs Route
router.post("/create_password", creatingPassword);

//Register Staffs Route
router.patch("/reset_password/:id", resetPassword);

export { router as staffRoute };

//Staffs can Create, Read annd Write Leave, Messages, and Query
//They can only delete if the
