import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const login = async (req, res, next) => { 
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(handleError(400, "Email and password are required"));
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(401, "Invalid email or password"));
    }

    // Check if password is correct
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(401, "Invalid email or password"));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      process.env.JWT_SECRET
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    })

    user.toObject({ getters: true }); 
    delete user.password; // Remove password from the user object before sending it in the response

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    next(handleError(500, error.message || "Server error during login"));
  }
}
export const GoogleLogin = async (req, res, next) => { 
  try {
    const { name, email, avatar } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new user
      const password = Math.random().toString(36).slice(-8); // Generate a random password for the new user
      const hashedPassword = await bcryptjs.hash(password, 10); // Hash the random password
      const newUser = new User({
        name, email, password: hashedPassword, avatar
      });
      user = await newUser.save();
    }


    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      process.env.JWT_SECRET
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    })

    user.toObject({ getters: true }); 
    delete user.password; // Remove password from the user object before sending it in the response

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    next(handleError(500, error.message || "Server error during login"));
  }
}