module.exports = {
  apps: [
    {
      name: 'wfengine-landing-page',
      cwd: '/var/www/wfengine-landing-page/current',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
