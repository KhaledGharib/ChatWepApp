const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors"); // Import the cors middleware

const app = express();
const server = http.createServer(app);

// Enable CORS for regular HTTP requests
app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 4000;

let count = 0;
io.on("connection", (socket) => {
  console.log("New user connected!");

  //   socket.emit("message", "Welcome!");

  // Listen for incoming messages from the client
  socket.on("sendMessage", (message) => {
    // Broadcast the message to all connected clients, including the sender
    io.emit("message", message);
  });

  socket.on("sendLocation", (coords) => {
    const googleMapsLink = `Check my location 👇 <br>
    <a href="https://www.google.com/maps?q=${coords.latitude},${coords.longitude}"  class="location-message" target="_blank">Location 📍</a>`;

    io.emit("message", googleMapsLink);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
