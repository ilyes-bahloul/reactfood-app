const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

app.use(bodyParser.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// CORS middleware for API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API Routes
app.get('/api/meals', (req, res) => {
  const mealsFilePath = path.join(__dirname, 'data', 'available-meals.json');
  const fileData = fs.readFileSync(mealsFilePath);
  const mealsData = JSON.parse(fileData);
  res.json(mealsData);
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body.order;
  console.log(orderData);
  res.json({ message: 'Order received!' });
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyA2tEzdpBIp9DEH1z5HCO1-dfS95gFUwY0');

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `You are a helpful food ordering assistant for ReactFood restaurant. 
    The user asked: "${message}"
    
    Please provide a helpful, friendly response. If they ask about food recommendations, 
    suggest items from our menu which includes pasta, pizza, salads, burgers, desserts, seafood, and breakfast items.
    Keep responses concise and engaging.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Sorry, I am having trouble connecting right now. Please try again later.' 
    });
  }
});

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Serving React app from /dist directory');
});

