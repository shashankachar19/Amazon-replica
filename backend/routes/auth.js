const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const { validateEmail } = require('../utils/emailValidator');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.message });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user (unverified)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      isEmailVerified: false,
      emailVerificationToken: verificationToken
    });
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken, username);
    
    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email before logging in. Check your inbox.',
        requiresVerification: true
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Email verification
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { emailVerificationToken: req.params.token } 
    });
    
    if (!user) {
      return res.redirect('http://localhost:5173/login?error=invalid_token');
    }
    
    await User.update(
      { isEmailVerified: true, emailVerificationToken: null },
      { where: { id: user.id } }
    );
    
    res.redirect('http://localhost:5173/login?verified=true');
  } catch (error) {
    res.redirect('http://localhost:5173/login?error=verification_failed');
  }
});

// Send verification email function
const sendVerificationEmail = async (email, token, username) => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const verificationUrl = `http://localhost:5000/api/auth/verify/${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your LOCAL E COMMERCE Account',
    html: `
      <h2>Welcome to LOCAL E COMMERCE, ${username}!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background: #FFD814; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `
  });
};

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'OAuth routes working' });
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('Google OAuth route hit');
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=oauth_failed' }),
  async (req, res) => {
    try {
      console.log('OAuth callback hit, user:', req.user);
      const profile = req.user;
      
      if (!profile || !profile.emails || !profile.emails[0]) {
        console.error('Invalid profile data:', profile);
        return res.redirect('http://localhost:5173/login?error=invalid_profile');
      }
      
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;
      
      // Check if user exists by email or googleId
      let user = await User.findOne({ 
        where: {
          [require('sequelize').Op.or]: [
            { email: email },
            { googleId: googleId }
          ]
        }
      });
      
      if (!user) {
        // Create new user
        user = await User.create({
          username: name,
          email: email,
          googleId: googleId,
          address: '',
          isEmailVerified: true
        });
        console.log('Created new user:', user.id);
      } else if (!user.googleId) {
        // Update existing user with googleId
        await user.update({ googleId: googleId });
        console.log('Updated existing user with googleId:', user.id);
      }
      
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax'
      });
      
      console.log('OAuth success, redirecting to home');
      res.redirect('http://localhost:5173/');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('http://localhost:5173/login?error=oauth_error');
    }
  }
);

// Complete registration route
router.post('/complete-registration', async (req, res) => {
  try {
    const { username, address, tempUserId, email, googleId } = req.body;
    
    // Find and delete unregistered user
    const unregisteredUser = await UnRegisteredUser.findByPk(tempUserId);
    if (unregisteredUser) {
      await unregisteredUser.destroy();
    }
    
    // Create registered user
    const user = await User.create({
      username,
      email,
      googleId,
      address,
      isEmailVerified: true
    });
    
    // Generate JWT for registered user
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });
    
    res.json({
      message: 'Registration completed successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({ message: 'Registration completion failed' });
  }
});

// Check auth status route
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'address']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update profile route
router.put('/update-profile', async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, address } = req.body;
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ username, address });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Delete account route
router.delete('/delete', async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    res.clearCookie('accessToken');
    res.clearCookie('accessTokenRegistration');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('accessTokenRegistration');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;