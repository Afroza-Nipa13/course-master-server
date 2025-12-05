import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { courseRoutes } from "./routes/course.routes.js";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express();

// 🟢 Connect to MongoDB ONLY ONCE — safe for Vercel Serverless
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
       
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 ROOT ROUTE — now works correctly
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Course Master Serverless API Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API route for documentation
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Course Master API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 🟢 EXPORT EXPRESS APP FOR VERCEL — DO NOT USE app.listen()
export default app;
