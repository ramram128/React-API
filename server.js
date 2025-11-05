// Load environment variables from a .env file (for local testing)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Use port from environment variable (PORT) or default to 3000
const PORT = process.env.PORT || 3000; 

// --- Middlewares ---
app.use(bodyParser.json());
// Allow requests from all origins (CORS) - necessary for your mobile app
app.use(cors()); 

// --- 1. MongoDB Connection Setup ---
// Get MongoDB URI from environment variables (must be set in .env or deployment config)
// You need to replace 'YOUR_MONGO_DB_URI' with your actual connection string.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/userDB'; 

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- 2. Define User Schema and Model ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    // NOTE: For a production app, always use password hashing (like bcrypt)
});

const User = mongoose.model('User', UserSchema);

// --- 3. API Routes ---

// Test route to ensure the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Login Endpoint (Handles POST request from React Native app)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        // Authentication Check
        if (user && user.password === password) {
            // Successful Login: return a token or success message
            // Replace with actual JWT token generation in a real app
            return res.status(200).json({ 
                message: 'Login successful', 
                token: 'simulated_auth_token_12345' 
            });
        } else {
            // Failed Login
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login database error:', error);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
});

// --- 4. Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log(`Local test URL: http://localhost:${PORT}`);
});