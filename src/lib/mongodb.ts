import mongoose from "mongoose";

function resolveMongoUri(): string {
  const uri = process.env.MONGODB_URI ?? "";
  if (!uri) return "";
  try {
    const parsed = new URL(uri);
    if (parsed.pathname.replace(/^\/+|\/+$/g, "")) return uri;
    const query = parsed.search || "";
    const base = query ? uri.slice(0, uri.indexOf("?")) : uri;
    return `${base.replace(/\/+$/, "")}/help-hub-bd${query}`;
  } catch {
    return uri;
  }
}

const MONGODB_URI = resolveMongoUri();

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API route usage.
 */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = globalThis.mongooseCache;

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default dbConnect;