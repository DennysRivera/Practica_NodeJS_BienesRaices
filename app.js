import express from "express"
import usuarioRoutes from "./routes/userRoutes.js"
const app = express()
const port = 3000;

app.use("/", usuarioRoutes)

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})