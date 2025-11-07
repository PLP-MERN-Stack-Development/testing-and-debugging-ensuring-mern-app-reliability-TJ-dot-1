const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if token has Bearer format
    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // For now, just attach a mock user and proceed
    // In real implementation, you would verify JWT here
    req.user = { id: 'mock-user-id', email: 'mock@example.com' };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { authenticate };