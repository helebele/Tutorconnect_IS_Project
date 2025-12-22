import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";

import userRoutes from "./routes/userRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
connectDB();

const app = express();
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
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all origins for development (you can restrict this later)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // For now, allow all origins to debug
    return callback(null, true);
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
    origin: "https://tutorconnect-is-project-wkih.vercel.app/", 
    methods: ["GET", "POST"],
    allowedHeaders: ["ngrok-skip-browser-warning"],
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => {
    console.log(`👤 User ${socket.id} joining room: ${room}`);
    socket.join(room);
    
    // Get all users currently in the room using Socket.io adapter
    const roomSet = io.sockets.adapter.rooms.get(room);
    const usersInRoom = [];
    if (roomSet) {
      for (const id of roomSet) {
        if (id !== socket.id) {
          usersInRoom.push(id);
        }
      }
    }

    console.log(`👥 Other users in room ${room}:`, usersInRoom);
    socket.emit("all-users", usersInRoom);

    // Notify others that a user joined
    socket.to(room).emit("user-joined", { socketId: socket.id });
  });

  socket.on("webrtc-offer", ({ room, offer, to }) => {
    console.log(`📡 [OFFER] from ${socket.id} to ${to} in room ${room}`);
    if (to) {
      io.to(to).emit("webrtc-offer", { from: socket.id, offer });
    }
  });

  socket.on("webrtc-answer", ({ room, answer, to }) => {
    console.log(`📡 [ANSWER] from ${socket.id} to ${to} in room ${room}`);
    if (to) {
      io.to(to).emit("webrtc-answer", { from: socket.id, answer });
    }
  });

  socket.on("webrtc-candidate", ({ room, candidate, to }) => {
    console.log(`📡 [CANDIDATE] from ${socket.id} to ${to} in room ${room}`);
    if (to) {
      io.to(to).emit("webrtc-candidate", { from: socket.id, candidate });
    }
  });

  // Chat Event
  socket.on("chat-message", ({ room, message, username }) => {
    console.log(`💬 [CHAT] in ${room} from ${username}: ${message}`);
    socket.to(room).emit("chat-message", { from: socket.id, message, username });
  });

  socket.on("disconnecting", () => {
    // Notify all rooms the user was in before they leave
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        console.log(`👋 User ${socket.id} leaving room: ${room}`);
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