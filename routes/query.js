import express from "express";
import {
  getQuery,
  addQuery,
  updateQuery,
} from "../controllers/queryController.js";

const router = express.Router();

//Gett All Query
router.get("/", getQuery);

//Add a Query
router.post("/", addQuery);

//Update Query Info
router.patch("/:id", updateQuery);

export { router as queryRoute };
