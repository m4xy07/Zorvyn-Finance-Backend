import mongoose from "mongoose";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

const cached = global.mongooseConnection ?? { conn: null, promise: null };

global.mongooseConnection = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri as string, {
      dbName: process.env.MONGODB_DB_NAME || "zorvyn_finance",
      autoIndex: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

