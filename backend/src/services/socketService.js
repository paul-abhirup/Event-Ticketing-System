const { Server } = require("socket.io");
const { subClient } = require("./redisService");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle joining ticket rooms
    socket.on("joinTicketRoom", (tokenId) => {
      const room = `ticket:${tokenId}`;
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    // Handle leaving ticket rooms
    socket.on("leaveTicketRoom", (tokenId) => {
      const room = `ticket:${tokenId}`;
      socket.leave(room);
      console.log(`Client ${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Subscribe to Redis channel for bid updates
  subClient.subscribe("ticket:*", (message, channel) => {
    try {
      const bidUpdate = JSON.parse(message);
      // Emit the bid update to all clients in the ticket's room
      io.to(channel).emit("newBid", bidUpdate);
    } catch (error) {
      console.error("Error processing Redis message:", error);
    }
  });

  return io;
};

module.exports = {
  initializeSocket,
  getIO: () => io, // Export the getIO function
};
