import { Server } from "socket.io";

class SocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });
  }

  initialize() {
    this.io.on("connection", (socket) => {
      console.log(`🟢 User connected: ${socket.id}`);

      // Join workspace room
      socket.on("joinWorkspace", (workspaceId) => {
        socket.join(workspaceId);
        console.log(`👥 ${socket.id} joined workspace: ${workspaceId}`);
      });

      // Drawing event
      socket.on("drawing", ({ workspaceId, drawingData }) => {
        socket.to(workspaceId).emit("drawing", { workspaceId, drawingData });
      });

      // Clear board event
      socket.on("clearBoard", ({ workspaceId }) => {
        socket.to(workspaceId).emit("clearBoard", { workspaceId });
      });

      // Disconnect
      socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketManager;
