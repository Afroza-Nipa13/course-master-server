// import express from "express";
// import { userRoutes } from "../src/routes/user.routes.js";
// import { courseRoutes } from "../src/routes/course.routes.js";
// import connectDB from "../src/config/db.js";
// import cors from "cors";

// const app = express();

// // Connect DB once at serverless startup
// (async () => {
//   try {
//     await connectDB();
//     console.log("MongoDB Connected on Vercel");
//   } catch (err) {
//     console.error("MongoDB Error:", err);
//   }
// })();

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Course Master Serverless API running",
//   });
// });

// // Routes
// app.use("/users", userRoutes);
// app.use("/courses", courseRoutes);

// // Export the app to Vercel
// export default app;


import express from "express";
import { envConfig } from "./config/index.js";
import { userRoutes } from "./routes/user.routes.js";
import { courseRoutes } from "./routes/course.routes.js"; 
import connectDB from "./config/db.js";
import cors from "cors";

const app = express();

// CORS (allow both localhost + vercel frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://course-master-ph.vercel.app"
    ],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = envConfig.port;

// -------------------------
// HEALTH CHECK (Root Route)
// -------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
    timestamp: new Date().toISOString()
  });
});

// -------------------------
// API DOCUMENTATION
// -------------------------
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Course Master API",
    version: "1.0.0",
    endpoints: {
      users: {
        register: "POST /users/register",
        login: "POST /users/login",
        get_user: "GET /users/user?email=email@example.com",
      },
      courses: {
        get_all: "GET /courses",
        single: "GET /courses/:id",
        featured: "GET /courses/featured",
      }
    }
  });
});

// Routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);

// 404 handler
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
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
