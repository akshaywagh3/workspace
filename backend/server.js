import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import SocketManager from "./src/sockets/socketManager.js";

const server = http.createServer(app);

// Initialize SocketManager
const socketManager = new SocketManager(server);
socketManager.initialize();

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// // socket middleware for authentication (later we’ll extend with JWT)
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) {
//     return next(new Error("Authentication error"));
//   }
//   // TODO: verify JWT here
//   socket.user = { id: "demoUser" }; 
//   next();
// });

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Join workspace (room)
//   socket.on("joinWorkspace", (workspaceId) => {
//     socket.join(workspaceId);
//     console.log(`User ${socket.id} joined workspace ${workspaceId}`);
//   });

//   // Handle drawing event
//   socket.on("draw", ({ workspaceId, drawingData }) => {
//     // broadcast to others in workspace
//     socket.to(workspaceId).emit("draw", drawingData);
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

export default server;
