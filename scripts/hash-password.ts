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
  // Two variants, because two different things read this value and only
  // one of them parses $ specially:
  //   - Next.js's OWN .env / .env.local file loader does $VAR-style
  //     expansion on unescaped $, corrupting a raw bcrypt hash on load
  //     (bit us 07-18). Use the ESCAPED (\$) version there.
  //   - Hosting panel env-var UIs (Hostinger, Vercel, Docker, etc.) set
  //     process.env directly with no file parsing step at all, so a \$
  //     lands as a literal backslash in the value and the hash no longer
  //     matches anything (bit us 07-22, login failed silently in prod
  //     because ADMIN_PASSWORD_HASH ?? '' in the login route uses
  //     whatever string it's given with no unescaping). Use the RAW
  //     version there.
  const escaped = hash.replace(/\$/g, '\\$');
  console.log('\n--- For .env.local (Next.js parses $ expansion in this file) ---');
  console.log('ADMIN_PASSWORD_HASH=' + escaped);
  console.log('\n--- For a hosting panel env var field: Hostinger, Vercel, Docker, etc. (raw process env, no $ parsing) ---');
  console.log('ADMIN_PASSWORD_HASH=' + hash);
  console.log(
    '\nUse the top one only inside .env.local, then restart `npm run dev`.' +
      '\nUse the bottom one anywhere env vars are set directly through a hosting UI, then redeploy/restart that service.' +
      '\nDo not mix them up, and check the pasted value has no leading/trailing whitespace or line break.'
  );
}

main();
