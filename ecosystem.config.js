module.exports = {
  apps: [
    {
      name: 'cyberstrike-ctf',
      script: 'server.js',
      cwd: 'D:\\\\ctf',
      watch: false,
      autorestart: true,
      max_restarts: 20,
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'D:\\\\ctf\\\\logs\\\\pm2-error.log',
      out_file: 'D:\\\\ctf\\\\logs\\\\pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },
    {
      name: 'cloudflare-tunnel',
      script: 'D:\\\\ctf\\\\bin\\\\cloudflared.exe',
      args: 'tunnel --url http://localhost:3000',
      watch: false,
      autorestart: true,
      max_restarts: 20,
      restart_delay: 5000,
      exp_backoff_restart_delay: 200,
      interpreter: 'none',
      error_file: 'D:\\\\ctf\\\\logs\\\\tunnel-error.log',
      out_file: 'D:\\\\ctf\\\\logs\\\\tunnel-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    }
  ]
};
