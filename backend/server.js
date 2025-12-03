// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const { connectDB } = require('./config/database');

// Import models to ensure table creation
require('./models/Order');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); // 👈 NEW CART ROUTE IMPORT
const adminRoutes = require('./routes/admin');

dotenv.config();
require('./config/passport');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// CRITICAL: STATIC FILE CONFIGURATION
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 


// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack })
    });
});

// Handle 404 for API routes only
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});