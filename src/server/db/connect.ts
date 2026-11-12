import mongoose from "mongoose";

// Cached on globalThis so dev hot-reload and warm serverless invocations reuse one connection.
const cache = globalThis as { _mongoose?: Promise<typeof mongoose> };

export function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  cache._mongoose ??= mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
    cache._mongoose = undefined; // let the next request retry instead of caching the failure
    throw err;
  });
  return cache._mongoose;
}
