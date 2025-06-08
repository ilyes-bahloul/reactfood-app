// Configuration for different environments
const config = {
  // For local development
  development: {
    apiBaseUrl: '/api'
  },
  // For Cloudflare Pages (static hosting)
  production: {
    // You'll need to deploy your backend separately and update this URL
    apiBaseUrl: 'https://your-backend-url.com/api'
  }
};

// Detect environment
const isDevelopment = import.meta.env.DEV;
const currentConfig = isDevelopment ? config.development : config.production;

export default currentConfig; 