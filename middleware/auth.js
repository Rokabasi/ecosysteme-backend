const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1];
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur de token:', err);
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = auth;
