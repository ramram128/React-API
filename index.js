// This file is the required entry point for Vercel's Express detection.
// It imports your core serverless function logic and exports it as an app handler.

// We need to import the core Express package to satisfy Vercel's Express check.
const express = require('express'); 

// This creates an Express app instance. 
// Vercel wraps this app and routes traffic to it.
const app = express();

// Set up the body parsing middleware (essential for receiving login data)
app.use(express.json()); 

// Manually route all traffic hitting the root path to your Serverless handler.
// Since your main logic is in api/index.js (which you previously renamed), 
// we assume you will handle the /api logic inside that handler.

// If you want all traffic to go through the API handler:
app.use('/api', require('./api/index'));

// 💡 Crucial: Export the app object for Vercel
module.exports = app;