// File: api/login.js
const mongoose = require('mongoose');

// Use the MONGODB_URI from environment variables (set in Vercel Dashboard)
const MONGODB_URI = process.env.MONGODB_URI;

// Define User Schema and Model (ensure this matches your server.js)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// Use mongoose.models to prevent schema re-compilation in serverless environments
const User = mongoose.models.User || mongoose.model('User', UserSchema);

let cachedDb = null;

// Function to connect or reuse cached connection
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
        // Vercel serverless functions use Node's http.ServerResponse object
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    // 2. Connect to the database
    await connectToDatabase();

    // Vercel automatically parses the body for us
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    try {
        const user = await User.findOne({ email });

        // 3. Authentication Check
        if (user && user.password === password) {
            res.status(200).json({
                message: 'Login successful',
                token: 'simulated_auth_token_vercel'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login database error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};