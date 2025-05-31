const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    console.log('No token found in request headers');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.log('JWT verification failed:', err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
