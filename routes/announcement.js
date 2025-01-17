import express from "express";
import {
  getAnnouncement,
  addAnnouncement,
} from "../controllers/announcementController.js";
import { requiredAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requiredAuth);

//Gett All Query
router.get("/", getAnnouncement);

//Add a Query
router.post("/", addAnnouncement);

//Update Query Info
// router.patch("/:id", updateAnnouncement);

export { router as announcementRoute };
