const http = require("http");
const app = require("./app");
const { subClient } = require("./services/redisService");
const { initializeSocket } = require("./services/socketService");

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a room for a specific ticket
  socket.on("joinTicketRoom", (tokenId) => {
    socket.join(`ticket:${tokenId}`); // Join a room named after the ticket ID
    console.log(`Client ${socket.id} joined room ticket:${tokenId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Subscribe to Redis channels for real-time bid updates
subClient.subscribe("ticket:*", (err, count) => {
  if (err) {
    console.error("Failed to subscribe to Redis channel:", err);
    return;
  }
  console.log(`Subscribed to ${count} Redis channel(s)`);
});

// Handle incoming Redis messages
subClient.on("message", (channel, message) => {
  try {
    const tokenId = channel.replace("ticket:", ""); // Extract tokenId from the channel
    const bidUpdate = JSON.parse(message); // Parse the message

    // Emit update to all clients in the ticket's room
    io.to(`ticket:${tokenId}`).emit("BID_UPDATED", bidUpdate);
    console.log(`Bid update emitted to room ticket:${tokenId}:`, bidUpdate);
  } catch (error) {
    console.error("Error processing Redis message:", error);
  }
});

// Start the server
const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the `io` instance for use in other files
module.exports = io;
