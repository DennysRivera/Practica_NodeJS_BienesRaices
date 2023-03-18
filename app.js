import express from "express"
import usuarioRoutes from "./routes/userRoutes.js"
const app = express()
const port = 3000;

app.set("view engine", "pug")
app.set("views", "./views")

app.use( express.static("public"))

app.use("/", usuarioRoutes)

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})