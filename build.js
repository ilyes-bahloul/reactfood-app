#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building ReactFood App for Production...\n');

try {
  // Step 1: Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Build React app
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 3: Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });

  // Step 4: Copy backend files to dist if needed
  console.log('📁 Preparing backend files...');
  
  // Create a simple start script
  const startScript = `#!/usr/bin/env node
const path = require('path');
process.chdir(path.join(__dirname, '..'));
require('./backend/app.js');
`;

  fs.writeFileSync('dist/start.js', startScript);
  fs.chmodSync('dist/start.js', '755');

  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Deployment Instructions:');
  console.log('1. Upload the entire project folder to your server');
  console.log('2. Run: npm start');
  console.log('3. Your app will be available on the configured port (default: 3000)');
  console.log('\n🌐 The app serves both frontend and backend from a single server!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 