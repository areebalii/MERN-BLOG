import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(handleError(401, 'Unauthorized: Please login first'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(handleError(401, 'Unauthorized: Invalid token'));
    console.log("DECODED TOKEN:", user); // 👈 check if it has 'id' or '_id'
    req.user = user;
    next();
  });
};