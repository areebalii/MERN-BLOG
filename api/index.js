import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g., http://localhost:5173
  process.env.ADMIN_URL     // e.g., http://localhost:5174
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json())


// Routes
app.use("/api/user", userRouter);
app.use('/api/post', postRouter);


mongoose.connect(process.env.MONGODB_CONN, { dbName: "mern-blog" })
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});



app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});