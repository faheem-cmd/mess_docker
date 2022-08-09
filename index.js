const express = require("express");
var mongoose = require("./services/mongoose");
var app = express();
var cors = require("cors");
app.use(cors());
require("dotenv").config();
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");
const router = require("./routes/user.router");
const { success, error } = require("consola");
app.use("/", router);
const socketio = require("socket.io");
//MongoDB connection
const dbName = "mess";
const dbUrl = process.env.DB_URL || `mongodb://0.0.0.0:27017/${dbName}`;
// const dbUrl = process.env.DB_URL;

app.use(express.static(__dirname));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
mongoose(dbUrl);
// mongoose(`mongodb://0.0.0.0:27017/${dbName}`);

mongoose.connect("mongodb://localhost/mess", { useNewUrlParser: true });
mongoose.connection
  .once("open", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });
//Server

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

// server.listen(3001, () => {
//   console.log("SERVER IS RUNNING");
// });

server.listen(process.env.PORT, () => {
  success({
    message: `Successfully connected with the database \n${dbUrl}`,
    badge: true,
  });

  success({
    message: `Server is running on \n${process.env.PORT}`,
    badge: true,
  });
});
