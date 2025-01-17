import express from "express";
import {
  getImage,
  addImage,
  updateImage,
} from "../controllers/imageController.js";
import { requiredAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requiredAuth);

//Gett All Query
router.get("/", getImage);

//Add a Query
router.post("/upload", addImage);

//Update Query Info
router.patch("/:id", updateImage);

export { router as imageRoute };
