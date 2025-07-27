// middleware/isAuthenticated.js
import jwt from 'jsonwebtoken';



export const isAuthenticated = (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // id, role, username
    console.log(decoded)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
