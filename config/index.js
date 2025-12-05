import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

export const envConfig = {
  mongodb_uri: process.env.MONGODB_URI,
  port: process.env.PORT || 5000, 
  jwt_secret: process.env.JWT_SECRET, 
  node_env: process.env.NODE_ENV || "development", 
};
