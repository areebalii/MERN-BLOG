import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  // Check Authorization header first, fallback to safe cookie parsing
  const authHeader = req.headers['authorization'];

  // 👈 Added ?. to prevent crashing if req.cookies doesn't exist
  const token = authHeader?.split(' ')[1] || req.cookies?.access_token;

  console.log("Token received:", token);

  if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });

    if (!decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.user = decoded;
    next();
  });
};