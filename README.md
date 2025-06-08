# ReactFood - Full Stack Food Ordering App

A modern, full-stack food ordering application built with React and Node.js, featuring AI-powered chatbot assistance.

## 🌟 Features

- **Modern UI/UX**: Beautiful, responsive design with animations
- **Food Menu**: Browse 20+ delicious meals with filtering and pagination
- **Shopping Cart**: Add items, manage quantities, and checkout
- **Food Details**: Detailed pages with reviews, ratings, and nutrition info
- **Review System**: Dynamic review and rating system with localStorage persistence
- **AI Chatbot**: Gemini AI-powered assistant for food recommendations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development servers:**
   ```bash
   npm run start:dev
   ```
   This runs both frontend (Vite) and backend (Express) concurrently.

3. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Production Build

1. **Build for production:**
   ```bash
   npm run build:full
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Access the app:**
   - Full app: http://localhost:3000

## 📁 Project Structure

```
food-order-app/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── store/             # Context API store
│   └── index.css          # Global styles
├── backend/               # Node.js backend
│   ├── app.js            # Express server
│   ├── data/             # JSON data files
│   └── package.json      # Backend dependencies
├── dist/                 # Built React app (after build)
├── public/               # Static assets
└── package.json          # Main package.json
```

## 🛠 Technology Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Generative AI** - Chatbot functionality
- **JSON** - Data storage

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### API Endpoints

- `GET /api/meals` - Fetch all meals
- `POST /api/orders` - Submit order
- `POST /api/chat` - Chat with AI assistant

## 🚀 Deployment Options

### Option 1: Single Server Deployment

The app is configured to serve both frontend and backend from a single Express server:

1. Build the project: `npm run build:full`
2. Upload entire project to your server
3. Install Node.js on server
4. Run: `npm start`

### Option 2: Platform Deployment

#### Heroku
```bash
# Add buildpack for Node.js
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Railway/Render
- Connect your GitHub repository
- Set build command: `npm run build:full`
- Set start command: `npm start`

## 🎨 Customization

### Styling
- Main styles: `src/index.css`
- CSS variables for easy theming
- Responsive breakpoints included

### Data
- Meals data: `backend/data/available-meals.json`
- Add/modify meals by editing the JSON file

### AI Chatbot
- Configure in `backend/app.js`
- Update prompts and responses
- Requires Google Gemini API key

## 👥 Authors

**Mohammed Taher Abdlhedi** and **Ilyes Bahloul**

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Enjoy your ReactFood experience! 🍕🍔🥗** 