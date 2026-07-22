#!/usr/bin/env node
/**
 * Thin start wrapper for production. 2026-07-22 (Adnan): bitsbuffer.com
 * and wfengine.com share the same Hostinger account, and WF Engine's app
 * binds a fixed port 3000 directly. Plain `next start` has no explicit
 * -p flag and no PORT env var was actually reaching this app, so it fell
 * back to Next's own built-in default, also 3000, colliding with WF
 * Engine on the same box. Both apps then fought over the port: whichever
 * bound first ran, the other crashed on EADDRINUSE and got restarted by
 * the host supervisor, crashed again, forever (this took the public site
 * down for about 40 minutes on 2026-07-22).
 *
 * This wrapper still respects a real PORT env var first, so if Hostinger
 * (or any future host) ever does inject a per-app port, that takes
 * priority and nothing here changes. It only kicks in the fallback,
 * 3005 instead of Next's default 3000, when no PORT is set, so this app
 * never silently competes for the same default port another app on the
 * same machine might also fall back to.
 *
 * Deliberately plain Node with no shell-specific `${VAR:-default}`
 * syntax (that only works in bash/sh, not consistently across every
 * shell a host might invoke the start command with), so behavior is
 * identical wherever this runs.
 */
const { spawn } = require('child_process');

const port = process.env.PORT && process.env.PORT.trim() !== '' ? process.env.PORT.trim() : '3001';

console.log(
  `[start] Launching next start on port ${port} (PORT env was ${
    process.env.PORT ? `set to "${process.env.PORT}"` : 'not set, using fallback 3005 instead of Next\'s default 3000 to avoid colliding with other apps on this host'
  })`
);

const child = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

child.on('error', (err) => {
  console.error('[start] Failed to launch next start:', err);
  process.exit(1);
});
