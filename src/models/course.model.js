// models/course.model.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      name: {
        type: String,
        required: true,
      },
      bio: String,
      email: String,
      profileImage: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "Design",
        "Business",
        "Marketing",
        "Music",
        "Photography",
        "Health & Fitness",
      ],
    },
    tags: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    duration: {
      type: String,
      required: true, // e.g., "10 hours", "8 weeks"
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/300x200",
    },
    syllabus: [
      {
        week: Number,
        title: String,
        topics: [String],
      },
    ],
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    prerequisites: [String],
    learningOutcomes: [String],
    resources: [
      {
        title: String,
        type: String, // 'video', 'pdf', 'link'
        url: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for faster queries
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, price: 1, rating: -1 });
courseSchema.index({ isFeatured: 1, createdAt: -1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;