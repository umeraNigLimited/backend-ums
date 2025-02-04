import express from "express";
import { requiredAuth } from "../middleware/requireAuth.js";
import { getStaff } from "../controllers/staffController.js";

const router = express.Router();

router.use(requiredAuth);

// router.post("/", addLogin);
router.get("/", getStaff);

export { router as staffRoute };
