import express from "express";
import {
  createMotivator,
  getAllMotivators,
  getMotivatorsMain,
} from "../controllers/motivator.controller";

const router = express.Router();

router.post("/createMotivator", createMotivator);
router.get("/getAllMotivators", getAllMotivators);
router.get("/getMotivatorsMain", getMotivatorsMain);

export default router;
