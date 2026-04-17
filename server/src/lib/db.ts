import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:password@localhost:27017/skillcollection?authSource=admin";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = { conn: null, promise: null };

/**
 * Connect to MongoDB using Mongoose
 * Uses connection caching to avoid multiple connections in serverless environments
 */
export async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    cached.conn = null;
  }
}

/**
 * Get current connection status
 */
export function getConnectionStatus() {
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  return states[mongoose.connection.readyState as keyof typeof states] || "Unknown";
}
