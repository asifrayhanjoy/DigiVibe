import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.warn("⚠️ MONGODB_URI / MONGO_URI / DATABASE_URL is missing in environment variables.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connUri = MONGO_URI;
    if (!connUri) {
      throw new Error("Missing MongoDB connection string. Please set MONGODB_URI, MONGO_URI, or DATABASE_URL in environment variables.");
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(connUri, opts).then((mongooseInstance) => {
      console.log(`✅ [Next.js API] Connected to MongoDB Atlas: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ [Next.js API] MongoDB Connection Error:", e);
    throw e;
  }

  return cached.conn;
}
