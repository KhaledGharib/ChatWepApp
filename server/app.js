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
  console.log(`New user connected!: ${socket.id}`);

  //   socket.emit("message", "Welcome!")
  socket.on("join", (room) => {
    socket.join(room);
    console.log(room);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
