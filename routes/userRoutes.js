import express from "express";
import { formForgotPassword, formLogin, formSignup } from "../controllers/userController.js"

const router = express.Router();

router.get("/login", formLogin);
router.get("/signup", formSignup);
router.get("/forgot-password", formForgotPassword);

export default router;