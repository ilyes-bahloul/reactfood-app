# Cloudflare Pages Deployment Guide

This guide will help you deploy your ReactFood app to Cloudflare Pages.

## 🚀 Quick Deployment (Frontend Only)

### Option 1: Static Frontend with Mock Data

1. **Build the static frontend:**
   ```bash
   npm run build:static
   ```

2. **Upload to Cloudflare Pages:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Upload the `dist` folder
   - Set build command: `npm run build:static`
   - Set output directory: `dist`

3. **Features that will work:**
   ✅ Menu browsing with local data
   ✅ Shopping cart functionality
   ✅ Food detail pages
   ✅ Review system (localStorage)
   ✅ Responsive design
   ❌ AI Chatbot (requires backend)
   ❌ Order submission (requires backend)

### Option 2: Full Stack with Separate Backend

1. **Deploy Backend First:**
   
   **Option A: Railway**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repo
   - Deploy only the `backend` folder
   - Set start command: `npm start`
   - Note your backend URL (e.g., `https://your-app.railway.app`)

   **Option B: Render**
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Update Frontend Configuration:**
   ```javascript
   // In src/config.js, update the production apiBaseUrl:
   production: {
     apiBaseUrl: 'https://your-backend-url.com/api'
   }
   ```

3. **Build and Deploy Frontend:**
   ```bash
   npm run build:static
   ```
   Upload `dist` folder to Cloudflare Pages

## 🛠 Build Commands for Cloudflare Pages

- **Build command:** `npm run build:static`
- **Output directory:** `dist`
- **Node.js version:** 18 or higher

## 📁 What Gets Deployed

The `dist` folder contains:
```
dist/
├── index.html          # Main HTML file
├── assets/            # CSS, JS, and other assets
│   ├── index-xxx.css  # Compiled CSS
│   └── index-xxx.js   # Compiled JavaScript
├── logo.jpg           # App logo
├── meals/            # Food images
└── _redirects        # Cloudflare Pages routing rules
```

## 🔧 Environment Variables (if using backend)

In your backend deployment platform, set:
```
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🌐 Custom Domain (Optional)

1. In Cloudflare Pages dashboard
2. Go to "Custom domains"
3. Add your domain
4. Update DNS records as instructed

## 🚨 Important Notes

1. **Static Deployment**: The frontend will work independently but without backend features
2. **CORS**: Make sure your backend allows requests from your Cloudflare Pages domain
3. **API URLs**: Update the production API URL in `src/config.js`
4. **Images**: All food images are included in the build

## 🔄 Continuous Deployment

Connect your GitHub repository to Cloudflare Pages for automatic deployments:

1. Go to Cloudflare Pages
2. Click "Connect to Git"
3. Select your repository
4. Set build settings:
   - Build command: `npm run build:static`
   - Output directory: `dist`
   - Root directory: `/` (leave empty)

## 📞 Troubleshooting

**Build fails?**
- Make sure Node.js version is 18+
- Check that all dependencies are in `package.json`

**Routing issues?**
- Ensure `_redirects` file is in the `public` folder
- Check that it's copied to `dist` during build

**API not working?**
- Verify backend is deployed and accessible
- Update API URL in `src/config.js`
- Check CORS settings in backend

---

**Your ReactFood app will be live on Cloudflare Pages! 🎉** 