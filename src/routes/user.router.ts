import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller";
import { validateForm } from "../middleware/validate.resource";

const router = express.Router();

router.post("/signup", validateForm, signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
