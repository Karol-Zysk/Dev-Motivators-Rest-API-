import express from "express";
import {
  login,
  logout,
  profile,
  isLoggedIn,
  signUp,
} from "../controllers/auth.controller";
import { validateForm } from "../middleware/validate.resource";

const router = express.Router();

router.post("/signup", validateForm, signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isLoggedIn, profile);

export default router;
