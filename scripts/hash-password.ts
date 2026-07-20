/**
 * Utility for (re)generating ADMIN_PASSWORD_HASH when you want to change
 * the admin password later. Never put the plaintext password in a file --
 * this only ever prints the hash, for you to paste into .env.local.
 *
 *   npm run hash-password -- "your-new-password"
 */
import bcrypt from 'bcryptjs';

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run hash-password -- "your-password"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  // Dollar signs escaped (\$) -- Next.js's env loader does $VAR expansion,
  // which silently corrupts an unescaped bcrypt hash on load (bit us on
  // 07-18: login failed with no error explaining why). Paste the escaped
  // version below, not the raw bcrypt output.
  const escaped = hash.replace(/\$/g, '\\$');
  console.log('\nADMIN_PASSWORD_HASH=' + escaped + '\n');
  console.log('Paste that line into .env.local (replacing the old ADMIN_PASSWORD_HASH line), then restart `npm run dev`.');
}

main();
