// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

dotenv.config();
connectDB();

const app = express();



const allowedOrigins = [
  "http://localhost:5173",
  "https://vocal-faloodeh-b9c5a1.netlify.app",
  "https://helpful-queijadas-ff9d02.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ✅ CORS: allow both local and Netlify frontend
// const allowedOrigins = [
//   // "http://localhost:5173", // local frontend
//   "http://localhost:5173", // ✅ Local development

//   "https://vocal-faloodeh-b9c5a1.netlify.app", // your Netlify frontend
//   "https://helpful-queijadas-ff9d02.netlify.app" // new deployed frontend
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed for this origin"), false);
//       }
//     },
//     credentials: true,
//   })
// );

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Webhook raw-body handling
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.post("/webhook", stripeWebhook);

// ✅ Test routes
app.get("/home", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello, I am coming from backend",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is the main page for the website running",
  });
});

// ✅ Ensure you're using correct port from Render
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
