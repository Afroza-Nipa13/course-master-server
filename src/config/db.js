// import mongoose from "mongoose";
// import { envConfig } from "./index.js";

// const connectDB = async () => {
//   try {
//     if (mongoose.Connection.readyState === 1) {
//       return {
//         success: true,
//         message: "Already connected to mongodb successfully",
//       };
//     }
//     if (!envConfig.mongodb_uri) {
//       return {
//         success: false,
//         message: "Mongodb uri doesn't exist",
//       };
//     }
//     await mongoose.connect(envConfig.mongodb_uri);
//     return {
//       success: true,
//       message: "Connected to mongodb using mongoose successfully",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };
// export default connectDB;

import mongoose from "mongoose";
import { envConfig } from "./index.js";

const connectDB = async () => {
  try {
    // Correct connection check!
    if (mongoose.connection.readyState === 1) {
      return {
        success: true,
        message: "Already connected to MongoDB successfully",
      };
    }

    if (!envConfig.mongodb_uri) {
      return {
        success: false,
        message: "MongoDB URI doesn't exist",
      };
    }

    await mongoose.connect(envConfig.mongodb_uri);

    return {
      success: true,
      message: "Connected to MongoDB using mongoose successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export default connectDB;
