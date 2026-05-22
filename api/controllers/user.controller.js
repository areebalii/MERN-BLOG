import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

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

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return next(handleError(400, "Email and password are required"));
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return next(handleError(401, "Invalid email or password"));
//     }

//     // Check if password is correct
//     const isMatch = await bcryptjs.compare(password, user.password);
//     if (!isMatch) {
//       return next(handleError(401, "Invalid email or password"));
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar
//       },
//       process.env.JWT_SECRET
//     );
//     res.cookie("access_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//       path: "/",
//     })

//     user.toObject({ getters: true });
//     delete user.password; // Remove password from the user object before sending it in the response

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user,
//       token
//     });
//   } catch (error) {
//     next(handleError(500, error.message || "Server error during login"));
//   }
// }
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: pass, ...rest } = user._doc;

    res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      })
      .json({
        success: true,
        message: "Login successful",
        user: rest,
        token  // ← this was missing, add it here
      });
  } catch (error) {
    next(error);
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user (defaults to "user" role)
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new User({
        name, email, password: hashedPassword, avatar
      });
      user = await newUser.save();
    }

    // 2. Generate JWT token with the current DB role value
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 3. Strip password safely
    const { password: pass, ...rest } = user._doc;

    // 4. Send clean response matching the standard login framework
    res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      })
      .json({
        success: true,
        message: "Login successful",
        user: rest
      });

  } catch (error) {
    next(handleError(500, error.message || "Server error during Google login"));
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    next(handleError(500, error.message || "Server error during logout"));
  }
};


// New controller function to get user stats for the profile page
export const getUserStats = async (req, res, next) => {
  try {
    // 1. Get the user ID from the request (from the URL or the JWT)
    const userId = req.params.id;

    // 2. Count posts where 'author' matches this user's ID
    const postCount = await Post.countDocuments({ author: userId });

    // 3. Get the latest 5 posts for the "My Posts" tab
    const recentPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      postCount,
      recentPosts
    });
  } catch (error) {
    next(error);
  }
};

// function to update user profile (name, avatar, etc.)
export const updateUser = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    let avatarUrl = req.body.avatar; // Keep old avatar if no new file

    if (req.file) {
      // Log this to see if the file is actually reaching the server
      console.log("File received:", req.file);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatarUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, bio, avatar: avatarUrl } },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Cloudinary/DB Error:", error); // This shows the error in your terminal
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let updateFields = { name, email };

    // 1. If a new password string is filled, re-hash it securely
    if (password) {
      updateFields.password = bcryptjs.hashSync(password, 10);
    }

    // 2. Upload file stream cleanly to Cloudinary if updated
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_avatars',
      });
      updateFields.avatar = result.secure_url;
    }

    // 3. Update the matching user schema profile block
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password'); // Strip password context string from response packet

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};