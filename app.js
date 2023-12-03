import express from "express"
import csrf from "csurf"
import cookieParser from "cookie-parser"
import usuarioRoutes from "./routes/userRoutes.js"
import propertyRoutes from "./routes/propertiesRoutes.js"
import appRoutes from "./routes/appRoutes.js"
import apiRoutes from "./routes/apiRoutes.js"
import db from "./config/db.js"
const app = express()
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}))

app.use(cookieParser());
app.use(csrf({cookie: true}))

try{
    await db.authenticate();
    db.sync()
    console.log("DB connected");
} catch (error){
    console.log(error)
}

app.set("view engine", "pug");
app.set("views", "./views");

app.use( express.static("public"));

app.use("/", appRoutes)
app.use("/auth", usuarioRoutes);
app.use("/properties", propertyRoutes);
app.use("/api", apiRoutes)

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})