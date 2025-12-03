const jwt = require('jsonwebtoken');

const verifyJWT_username = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.username) {
      return res.status(401).json({ message: 'Invalid token format.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const verifyJWT_email = (req, res, next) => {
  const token = req.cookies.accessTokenRegistration;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No registration token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      return res.status(401).json({ message: 'Invalid registration token format.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid registration token.' });
  }
};

module.exports = { verifyJWT_username, verifyJWT_email };