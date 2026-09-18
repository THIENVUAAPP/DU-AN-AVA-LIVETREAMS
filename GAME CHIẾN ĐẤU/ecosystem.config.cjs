/**
 * Cấu hình pm2 để chạy server 24/7: tự khởi động lại nếu crash, tự chạy lại
 * khi khởi động máy (sau khi làm theo README mục "Chạy 24/7 với pm2").
 */
module.exports = {
  apps: [
    {
      name: 'kingdom-clash',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
