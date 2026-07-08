module.exports = {
  apps: [
    {
      name: "patient-timeseries-backend",
      script: "dist/backend/src/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
