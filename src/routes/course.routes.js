// routes/course.routes.js
import { Router } from "express";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

const router = Router();

// 📌 1. GET ALL COURSES WITH FILTERING, SORTING, PAGINATION, SEARCHING
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      tags,
      instructor,
      isFeatured,
    } = req.query;

    // Build filter query
    const filter = { isPublished: true };

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "instructor.name": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by level
    if (level) {
      filter.level = level;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by tags
    if (tags) {
      const tagsArray = tags.split(",");
      filter.tags = { $in: tagsArray };
    }

    // Filter by instructor
    if (instructor) {
      filter["instructor.name"] = { $regex: instructor, $options: "i" };
    }

    // Filter by featured
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    // Build sort query
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-syllabus -resources -prerequisites -learningOutcomes"),
      Course.countDocuments(filter),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / parseInt(limit));

    // Get unique categories, levels, and tags for filters
    const [categories, levels, allTags] = await Promise.all([
      Course.distinct("category", { isPublished: true }),
      Course.distinct("level", { isPublished: true }),
      Course.distinct("tags", { isPublished: true }),
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        categories,
        levels,
        tags: allTags.filter(tag => tag), // Remove empty tags
        priceRange: {
          min: await Course.findOne({ isPublished: true }).sort({ price: 1 }).select("price"),
          max: await Course.findOne({ isPublished: true }).sort({ price: -1 }).select("price"),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
});

// 📌 2. GET SINGLE COURSE BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Increment view count (optional)
    await Course.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
});

// 📌 3. CREATE NEW COURSE (Admin/Instructor only - add auth middleware later)
router.post("/", async (req, res) => {
  try {
    const courseData = req.body;

    // Validate required fields
    const requiredFields = ["title", "description", "instructor", "category", "price", "duration"];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
});

// 📌 4. UPDATE COURSE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
});

// 📌 5. DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
});

// 📌 6. GET FEATURED COURSES
router.get("/featured", async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const featuredCourses = await Course.find({ isFeatured: true, isPublished: true })
      .limit(parseInt(limit))
      .select("title description instructor category price imageUrl rating enrolledStudents");

    res.json({
      success: true,
      data: featuredCourses,
    });
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured courses",
      error: error.message,
    });
  }
});

// 📌 7. GET COURSES BY CATEGORY
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category, isPublished: true })
      .select("title description instructor price imageUrl rating duration");

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching category courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category courses",
      error: error.message,
    });
  }
});

// 📌 8. SEARCH COURSES
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "instructor.name": { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
      isPublished: true,
    }).limit(20);

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error searching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error searching courses",
      error: error.message,
    });
  }
});

export default router;
export const courseRoutes = router;