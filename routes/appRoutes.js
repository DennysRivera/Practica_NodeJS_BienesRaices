import express from "express"
import { landing, category, notFound, search } from "../controllers/appController.js"

const router = express.Router()

router.get("/", landing)
router.get("/categories/:id", category)
router.get("/404", notFound)
router.get("/search", search)

export default router;