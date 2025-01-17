import express from "express";
import {
  getLeave,
  addLeave,
  updateLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

//Gett All Leave
router.get("/", getLeave);

//Add a Leave
router.post("/", addLeave);

//Update Leave Info
router.patch("/:id", updateLeave);

export { router as leaveRoute };
