import bcrypt from 'bcryptjs';

// bcryptjs (pure JS) not the native `bcrypt` package: this project has no
// native-module build step and runs on a single dev machine + eventually
// DigitalOcean, pure JS avoids a node-gyp/platform-binary failure class
// entirely for a login path that only runs a handful of times a day.

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
