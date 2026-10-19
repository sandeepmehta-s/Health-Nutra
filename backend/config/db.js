import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/health_nutra";
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    console.error(`[MongoDB] Please ensure MongoDB is running locally (e.g. 'mongod' or MongoDB Compass/Service) or provide a valid MONGODB_URI in .env`);
    return null;
  }
}
