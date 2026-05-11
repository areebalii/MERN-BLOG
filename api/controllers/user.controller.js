import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      // It's better to use your handleError here too!
      return next(handleError(400, "Name, email, and password are required"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Added return here to stop execution
      return next(handleError(409, "User with this email already exists"));
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    // Use hash (async) instead of hashSync for better performance in async functions
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    // Now next exists, so this won't crash the server anymore!
    next(handleError(500, error.message || "Server error during registration"));
  }
}

export const login = async (req, res) => { 

}