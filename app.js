import express from "express"
import usuarioRoutes from "./routes/userRoutes.js"
import db from "./config/db.js"
const app = express()
const port = 3000;

try{
    await db.authenticate();
    console.log("DB connected");
} catch (error){
    console.log(error)
}

app.set("view engine", "pug")
app.set("views", "./views")

app.use( express.static("public"))

app.use("/auth", usuarioRoutes)

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})