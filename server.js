// This file runs only when the /api/login endpoint is hit.

const mongoose = require('mongoose');

// Use the MONGODB_URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Define User Schema and Model (same as before)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Connection state check to prevent connection throttling
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db;
    return db;
}

// The main handler function for the Vercel serverless endpoint
module.exports = async (req, res) => {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Connect to the database
    await connectToDatabase();

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        // 3. Authentication Check
        if (user && user.password === password) {
            return res.status(200).json({
                message: 'Login successful',
                token: 'simulated_auth_token_vercel'
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login database error:', error);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
};