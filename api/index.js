import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.route.js";
import categoryRouter from "./routes/category.route.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://mern-blog-backend-xi.vercel.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or local postman testers
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔌 Serverless-Safe MongoDB Pooling Strategy
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  console.log("Creating brand new database connection instance pool...");
  cachedConnection = await mongoose.connect(process.env.MONGODB_CONN, {
    dbName: "mern-blog",
    bufferCommands: false, // Turn off buffering so errors surface immediately
  });
  return cachedConnection;
};

// Route-intercept middleware to guarantee connection state safely before route handling
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection middleware crash:", error);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// Routes
app.use("/api/user", userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/category', categoryRouter);
app.use('/api/admin', adminRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the G-Blog API!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

export default app;

// Local development server listener block
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
  });
}