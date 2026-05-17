import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });

  
    console.log("DECODED ADMIN TOKEN:", decoded);

    // Check if the role matches
    if (!decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({
        message: `Forbidden: You are not an admin. Your current token role is: ${decoded.role}`
      });
    }
    console.log("Admin verified successfully with role:", decoded.role);

    req.user = decoded;
    next();
  });
};