import express from "express";
import { formLogin, formSignup } from "../controllers/userController.js"

const router = express.Router();

router.get("/login", formLogin);
router.get("/signup", formSignup)

export default router;