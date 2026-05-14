import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(handleError(401, 'Unauthorized: Please login first'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(handleError(401, 'Unauthorized: Invalid token'));
    }

    // This 'user' object now contains the id, role, etc.,
    req.user = user;
    next();
  });
};