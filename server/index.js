import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import employeeRoutes from "./Routes/employeeRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import leaveRoutes from "./Routes/leaveRoutes.js"
import authenticate from "./Routes/auth.js";
import leaveHistoryRoutes from "./Routes/leaveHistoryRoutes.js";


dotenv.config()
let app = express() 
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.json())


app.use('/employees', employeeRoutes)
app.use('/projects', projectRoutes)
app.use('/leaves', leaveRoutes)
app.use('/login', authenticate)
app.use('/leaveHistory', leaveHistoryRoutes)

const uri = process.env.URI 
mongoose.connect(uri)
mongoose.connection.once("open", () => {
    console.log("mongodb server is connected")
})

app.listen(port, () => console.log("server is connected to port 3000"))
