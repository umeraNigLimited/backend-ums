import express from "express";
import {
  getReport,
  getSingleReport,
  addReport,
  updateReport,
  deleteReport,
} from "../controllers/reportController.js";
import { requiredAuth } from "../middleware/requireAuth.js";

const router = express.Router();

//Gett All Report
router.get("/", getReport);

router.use(requiredAuth);
//Get Single Report
router.get("/:id", getSingleReport);

//Add a Report
router.post("/", addReport);

//Update Report Info
router.patch("/:id", updateReport);

//Delete a Report
router.delete("/:id", deleteReport);

export { router as reportRoute };

//Reports can Create, Read annd Write Leave, Messages, and Query
//They can only delete if the
