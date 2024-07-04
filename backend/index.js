// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User'); // Define User model

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://broti:Broti143@cluster0.bjvjbsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Secret key for JWT
const jwtSecret = "doggi";

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.error('MongoDB connection error:', err));

// JWT middleware function
const verifyToken = (req, res, next) => {
  // Get token from header
  const bearerHeader = req.headers['authorization'];
  
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

// Routes

// Signup route
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, dob, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      dob,
      email,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Error signing up:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email: username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
  } });
    });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch all users (protected route)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Verify JWT token
    jwt.verify(req.token, jwtSecret, async (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        // Fetch all users from database
        const users = await User.find();
        res.json(users);
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

