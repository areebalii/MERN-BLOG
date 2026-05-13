import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });

    // Check if the role in the token is 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You are not an admin" });
    }

    req.user = decoded;
    next();
  });
};