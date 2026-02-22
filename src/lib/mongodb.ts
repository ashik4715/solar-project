import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const { mongoose: globalCache } = global as any;
let cached = globalCache || { conn: null, promise: null };
let memoryServer: MongoMemoryServer | null = null;

async function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
    console.warn(
      "[mongodb] MONGODB_URI not set. Using in-memory MongoDB for local/testing.",
    );
  }
  return memoryServer.getUri();
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = getMongoUri().then((uri) => mongoose.connect(uri, opts));
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  (global as any).mongoose = cached;
  return cached.conn;
}
