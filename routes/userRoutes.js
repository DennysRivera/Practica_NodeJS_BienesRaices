import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hola mundo!")
})

router.get("/json", (req, res) => {
    res.json({msg: "Esto es un JSON"})
})

export default router;