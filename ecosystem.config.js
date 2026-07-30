module.exports = {
  apps: [
    {
      name: 'bitsbuffer-landing-page',
      cwd: '/var/www/bitsbuffer-landing-page/current',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3010',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
};
