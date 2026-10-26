module.exports = {
  apps: [
    {
      name: 'ghest-backend',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 7777,
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
    },
  ],
};
