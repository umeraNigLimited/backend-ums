import express from "express";
import {
  getStaffs,
  getSingleStaff,
  addStaffs,
  updateStaff,
  deleteStaffs,
} from "../controllers/adminController.js";

const router = express.Router();
//Login and Register Route

//Gett All Staff
router.get("/", getStaffs);

//Get Single Staff
router.get("/:id", getSingleStaff);

//Add a Staff
router.post("/", addStaffs);

//Update Staff Info
router.patch("/:id", updateStaff);

//Delete a Staff
router.delete("/:id", deleteStaffs);

export { router as admiRoute };

//Staffs can Create, Read annd Write Leave, Messages, and Query
//They can only delete if the
