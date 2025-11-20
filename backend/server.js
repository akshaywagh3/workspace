import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import SocketManager from "./src/sockets/socketManager.js";
import setupChatSocket from "./sockets/chatSocket.js";
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

const io = new Server(server , {
    cors:{
        origin : process.env.CLIENT_URL || "http://localhost:5173",
        methods: ['POST','GET'],
    },
});

setupChatSocket(io, { jwtSecret: process.env.JWT_SECRET, logger: console });


export default server;
