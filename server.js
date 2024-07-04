import express from "express";

import "dotenv/config.js"
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from"cors"
const app = express();
import { limiter } from "./config/ratelimiter.js";
const port = process.env.PORT || 5001;

// Middle ware
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 
app.use(express.static('public'))
app.use(fileUpload());
app.use(helmet())
app.use(limiter)
app.use(cors())



//* routes import

import ApiRoutes from "./routes/api.js"


app.use("/api/",ApiRoutes)








app.listen(port, () => {
    console.log(`hi i am running on ${port}`);
})