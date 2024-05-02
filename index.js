import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import employeeRouter from "./employee/employee.js";
import adminRouter from "./components/admin/admin.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/admin",adminRouter);
// app.use("/api/employee",employeeRouter);

function connectToDB(){
    const url = process.env.MONGODB_URL;
    mongoose.connect(url)
    .then(()=>console.log("Connected to DB"))
    .catch((err)=>console.log(err));
}
connectToDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
