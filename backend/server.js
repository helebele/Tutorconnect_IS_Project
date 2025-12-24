import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import userRoutes from "./routes/userRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://tutorconnect-five.vercel.app",
  "https://tutorconnect-is-project-wkih.vercel.app/",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Socket.io / WebRTC Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://tutorconnect-is-project-wkih.vercel.app/", "http://localhost:5173",
      "http://localhost:4173"],
    allowedHeaders: ["ngrok-skip-browser-warning"],
    credentials: true
  }
});

// Socket.IO Security Helpers
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove HTML tags, script tags, and dangerous characters
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .substring(0, 1000); // Max length protection
  }
  return input;
};

const sanitizeSocketData = (data) => {
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value;
    }
    return sanitized;
  }
  return data;
};

const validateRoomName = (room) => {
  if (!room || typeof room !== 'string') return false;
  // Allow alphanumeric, hyphens, underscores, max 100 chars
  return /^[a-zA-Z0-9_-]{1,100}$/.test(room);
};


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => {
    // Validate and sanitize room name
    const sanitizedRoom = sanitizeInput(room);
    if (!validateRoomName(sanitizedRoom)) {
      console.log(`Invalid room name from ${socket.id}:`, room);
      socket.emit("error", { message: "Invalid room name" });
      return;
    }

    console.log(`User ${socket.id} joining room: ${sanitizedRoom}`);
    socket.join(sanitizedRoom);

    // Get all users currently in the room using Socket.io adapter
    const roomSet = io.sockets.adapter.rooms.get(sanitizedRoom);
    const usersInRoom = [];
    if (roomSet) {
      for (const id of roomSet) {
        if (id !== socket.id) {
          usersInRoom.push(id);
        }
      }
    }

    console.log(`Other users in room ${sanitizedRoom}:`, usersInRoom);
    socket.emit("all-users", usersInRoom);

    // Notify others that a user joined
    socket.to(sanitizedRoom).emit("user-joined", { socketId: socket.id });
  });

  socket.on("webrtc-offer", ({ room, offer, to }) => {
    const sanitizedRoom = sanitizeInput(room);
    if (!validateRoomName(sanitizedRoom)) {
      socket.emit("error", { message: "Invalid room name" });
      return;
    }

    console.log(`[OFFER] from ${socket.id} to ${to} in room ${sanitizedRoom}`);
    if (to && typeof to === 'string') {
      io.to(to).emit("webrtc-offer", { from: socket.id, offer });
    }
  });

  socket.on("webrtc-answer", ({ room, answer, to }) => {
    const sanitizedRoom = sanitizeInput(room);
    if (!validateRoomName(sanitizedRoom)) {
      socket.emit("error", { message: "Invalid room name" });
      return;
    }

    console.log(`[ANSWER] from ${socket.id} to ${to} in room ${sanitizedRoom}`);
    if (to && typeof to === 'string') {
      io.to(to).emit("webrtc-answer", { from: socket.id, answer });
    }
  });

  socket.on("webrtc-candidate", ({ room, candidate, to }) => {
    const sanitizedRoom = sanitizeInput(room);
    if (!validateRoomName(sanitizedRoom)) {
      socket.emit("error", { message: "Invalid room name" });
      return;
    }

    console.log(`[CANDIDATE] from ${socket.id} to ${to} in room ${sanitizedRoom}`);
    if (to && typeof to === 'string') {
      io.to(to).emit("webrtc-candidate", { from: socket.id, candidate });
    }
  });

  // Chat Event with XSS Protection
  socket.on("chat-message", ({ room, message, username }) => {
    // Sanitize all user inputs
    const sanitizedRoom = sanitizeInput(room);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedUsername = sanitizeInput(username);

    // Validate room name
    if (!validateRoomName(sanitizedRoom)) {
      socket.emit("error", { message: "Invalid room name" });
      return;
    }

    // Validate message length (prevent spam)
    if (!sanitizedMessage || sanitizedMessage.length > 1000) {
      socket.emit("error", { message: "Invalid message length" });
      return;
    }

    // Validate username
    if (!sanitizedUsername || sanitizedUsername.length > 50) {
      socket.emit("error", { message: "Invalid username" });
      return;
    }

    console.log(`[CHAT] in ${sanitizedRoom} from ${sanitizedUsername}`);
    socket.to(sanitizedRoom).emit("chat-message", {
      from: socket.id,
      message: sanitizedMessage,
      username: sanitizedUsername
    });
  });

  socket.on("disconnecting", () => {
    // Notify all rooms the user was in before they leave
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        console.log(`User ${socket.id} leaving room: ${room}`);
        socket.to(room).emit("user-disconnected", socket.id);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});