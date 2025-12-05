import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { userRoutes } from "./routes/user.routes.js";
import { courseRoutes } from "./routes/course.routes.js";

const app = express();

connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.use(
  cors({
    origin: ["http://localhost:3000",
              "https://course-master-ph.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Course Master Serverless API Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Course Master API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", userRoutes);
app.use("/api", courseRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
