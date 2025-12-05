// src/scripts/seedCourses.js
import mongoose from "mongoose";
import Course from "../models/course.model.js";
import dotenv from "dotenv";

dotenv.config();

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn web development from scratch. HTML, CSS, JavaScript, React, Node.js, MongoDB and more!",
    instructor: {
      name: "John Doe",
      bio: "Senior Web Developer with 10+ years of experience",
      email: "john@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    category: "Web Development",
    tags: ["javascript", "react", "nodejs", "mongodb", "fullstack"],
    price: 2999,
    discountedPrice: 1999,
    duration: "60 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    syllabus: [
      {
        week: 1,
        title: "HTML & CSS Fundamentals",
        topics: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "Grid"],
      },
      {
        week: 2,
        title: "JavaScript Basics",
        topics: ["Variables", "Functions", "DOM Manipulation", "Events"],
      },
    ],
    enrolledStudents: 1245,
    rating: 4.7,
    totalReviews: 245,
    isFeatured: true,
    prerequisites: ["Basic computer knowledge"],
    learningOutcomes: [
      "Build full-stack web applications",
      "Understand REST APIs",
      "Deploy applications to cloud",
    ],
  },
  {
    title: "Machine Learning A-Z",
    description: "Learn Machine Learning from basics to advanced concepts with Python",
    instructor: {
      name: "Jane Smith",
      bio: "Data Scientist at Google, ML Expert",
      email: "jane@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    category: "Machine Learning",
    tags: ["python", "ml", "ai", "tensorflow", "data-science"],
    price: 3999,
    duration: "80 hours",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    enrolledStudents: 856,
    rating: 4.8,
    totalReviews: 189,
    isFeatured: true,
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps using React Native",
    instructor: {
      name: "Mike Johnson",
      bio: "Mobile Developer, Created 50+ apps",
      email: "mike@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    category: "Mobile Development",
    tags: ["react-native", "mobile", "javascript", "ios", "android"],
    price: 2499,
    discountedPrice: 1799,
    duration: "45 hours",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    enrolledStudents: 567,
    rating: 4.5,
    totalReviews: 123,
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of UI/UX design",
    instructor: {
      name: "Sarah Williams",
      bio: "Lead Designer at Adobe",
      email: "sarah@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    category: "Design",
    tags: ["design", "ui", "ux", "figma"],
    price: 1999,
    discountedPrice: 1499,
    duration: "40 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    enrolledStudents: 890,
    rating: 4.6,
    totalReviews: 156,
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis and visualization",
    instructor: {
      name: "David Chen",
      bio: "Data Science Instructor",
      email: "david@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    category: "Data Science",
    tags: ["python", "data-science", "pandas", "numpy"],
    price: 2299,
    duration: "50 hours",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1526379879527-8559ecfcaecb?w=400&h=300&fit=crop",
    enrolledStudents: 1200,
    rating: 4.4,
    totalReviews: 210,
    isFeatured: true,
  },
  {
    title: "Digital Marketing Mastery",
    description: "Complete guide to digital marketing strategies",
    instructor: {
      name: "Lisa Brown",
      bio: "Marketing Expert",
      email: "lisa@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    category: "Marketing",
    tags: ["marketing", "seo", "social-media"],
    price: 1799,
    discountedPrice: 1299,
    duration: "35 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    enrolledStudents: 750,
    rating: 4.3,
    totalReviews: 98,
  },
  {
    title: "Cybersecurity Basics",
    description: "Introduction to cybersecurity principles and practices",
    instructor: {
      name: "Alex Johnson",
      bio: "Security Analyst",
      email: "alex@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    category: "Business",
    tags: ["cybersecurity", "security", "networking"],
    price: 2799,
    duration: "45 hours",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    enrolledStudents: 560,
    rating: 4.7,
    totalReviews: 134,
  },
  {
    title: "Business Analytics",
    description: "Data-driven business decision making",
    instructor: {
      name: "Michael Taylor",
      bio: "Business Consultant",
      email: "michael@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    category: "Business",
    tags: ["business", "analytics", "excel", "tableau"],
    price: 2199,
    discountedPrice: 1699,
    duration: "30 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    enrolledStudents: 920,
    rating: 4.5,
    totalReviews: 187,
  },
  {
    title: "Music Production Fundamentals",
    description: "Learn music production from scratch",
    instructor: {
      name: "Chris Wilson",
      bio: "Music Producer",
      email: "chris@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    category: "Music",
    tags: ["music", "production", "audio", "mixing"],
    price: 1899,
    duration: "40 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    enrolledStudents: 430,
    rating: 4.8,
    totalReviews: 76,
  },
  {
    title: "Photography Masterclass",
    description: "Professional photography techniques",
    instructor: {
      name: "Emma Davis",
      bio: "Professional Photographer",
      email: "emma@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    category: "Photography",
    tags: ["photography", "camera", "editing", "lighting"],
    price: 1699,
    discountedPrice: 1299,
    duration: "25 hours",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
    enrolledStudents: 680,
    rating: 4.6,
    totalReviews: 112,
    isFeatured: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    
    // ✅ FIXED: Remove deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing courses
    console.log("🗑️  Clearing existing courses...");
    const deleted = await Course.deleteMany({});
    console.log(`✅ Cleared ${deleted.deletedCount} existing courses`);

    // Insert sample courses
    console.log("📥 Inserting sample courses...");
    const result = await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${result.length} sample courses`);

    // Verify insertion
    const count = await Course.countDocuments();
    console.log(`📊 Total courses in database: ${count}`);

    // Show sample data
    console.log("\n📝 Sample Courses:");
    result.slice(0, 3).forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - $${course.price} - ${course.category}`);
    });

    console.log("\n🎉 Database seeded successfully!");
    
    // Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    
    if (error.errors) {
      console.error("Validation errors:");
      Object.keys(error.errors).forEach(key => {
        console.error(`  ${key}: ${error.errors[key].message}`);
      });
    }
    
    process.exit(1);
  }
};

seedDatabase();