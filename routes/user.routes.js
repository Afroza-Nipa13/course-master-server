// import { Router } from "express";
// import User from "../models/user.model.js";
// import bcrypt from "bcrypt";

// const router = Router();
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
  
  
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exist" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await User.create({ name, email, password: hashedPassword });
    
//     //In schema there is no hashPass so that i implemented password

//     return res
//       .status(201)
//       .json({
//         success: true,
//         message: "User registered successfully",
//         data: result,
//       });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });



// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Wrong credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// export const userRoutes = router;

import { Router } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import User from "../models/user.model.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ name, email, password: hashedPassword });
    
    // Remove password from response
    const userResponse = {
      _id: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
      createdAt: result.createdAt
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Create token (optional - for direct API use)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data for NextAuth
    res.json({
      success: true,
      token, // Optional
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: err.message 
    });
  }
});

// ✅ ADD THIS: GET USER BY EMAIL (for NextAuth)
router.get("/users", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user without password
    const user = await User.findOne({ email }).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;
export const userRoutes = router;