import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";


dotenv.config({});
connectDB();

const app=express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

const port=process.env.PORT;

console.log(port);

app.use("/api/v1/user",userRoute);


app.use("/api/v1/course",courseRoute);

app.use("/api/v1/media",mediaRoute);

app.use("/api/v1/purchase", purchaseRoute);

app.use("/api/v1/progress", courseProgressRoute);






app.get("/home",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"hello i am coming from backend"
    })
})

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"this is a main page for the website runnning "
    })
})


app.listen(port,()=>{
    console.log(`server runing at port http://localhost:${port}`);
})