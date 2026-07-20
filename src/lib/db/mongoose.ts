import mongoose from 'mongoose';

// Single cached connection, standard Next.js-with-Mongoose pattern: without
// this, every hot-reload in dev (and every serverless invocation in prod)
// would open a new connection and eventually exhaust MongoDB's connection
// limit. Cached on `globalThis` so it survives Next.js's module reloading
// in dev, not just a module-level variable (which webpack/turbopack can
// re-evaluate on hot reload).

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.local.example to .env.local and set MONGODB_URI ' +
        '(e.g. mongodb://127.0.0.1:27017/bitsbuffer for a local MongoDB instance).'
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        // Fail fast instead of hanging silently if MongoDB isn't running
        // locally -- the dev-lead "assume the sad path" rule, this exact
        // failure mode (MongoDB not started) is the most likely one during
        // local dev.
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => m)
      .catch((err) => {
        cache.promise = null;
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
