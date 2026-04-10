import express from "express";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

// No JWT middleware as requested by user
router.post("/ask", askAI);

export default router;
