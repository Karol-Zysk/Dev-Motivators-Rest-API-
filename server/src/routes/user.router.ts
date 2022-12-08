import express from "express";
import { signUp } from "../controllers/auth.controller";
import { validateForm } from "../middleware/validate.resource";

const router = express.Router();

router.post("/signup", validateForm, signUp);

export default router;
