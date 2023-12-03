import express from "express";
import { formLogin, authenticateUser, logout, registerUser, confirmAccount, formForgotPassword, formSignup, resetPassword, confirmToken, newPassword } from "../controllers/userController.js"

const router = express.Router();

router.get("/login", formLogin);
router.post("/login", authenticateUser);
router.post("/logout", logout)
router.get("/signup", formSignup);
router.post("/signup", registerUser);
router.get("/confirm/:token", confirmAccount);
router.get("/forgot-password", formForgotPassword);
router.post("/forgot-password", resetPassword);
router.get("/forgot-password/:token", confirmToken);
router.post("/forgot-password/:token", newPassword);

export default router;