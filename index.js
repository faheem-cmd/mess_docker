const express = require("express");
var mongoose = require("./services/mongoose");
var app = express();
var cors = require("cors");
app.use(cors());
require("dotenv").config();
const router = require("./routes/user.router");
const { success, error } = require("consola");
app.use("/", router);
const http = require("http");
const socketio = require("socket.io");
//MongoDB connection
const dbName = "mess";
const dbUrl = process.env.DB_URL || `mongodb://0.0.0.0:27017/${dbName}`;
// const dbUrl = process.env.DB_URL;

const ws = require("ws");
const wsServer = new ws.Server({ noServer: true });
wsServer.on("connection", (socket) => {
  socket.on("message", (message) => console.log(message.toString()));
});

const server = app.listen(3000);
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

// mongoose(dbUrl);
mongoose(`mongodb://0.0.0.0:27017/${dbName}`);

// mongoose.connect("mongodb://localhost/mess", { useNewUrlParser: true });
// mongoose.connection
//   .once("open", function () {
//     console.log("Database connected Successfully");
//   })
//   .on("error", function (err) {
//     console.log("Error", err);
//   });
//Server
app.listen(process.env.PORT, () => {
  success({
    message: `Successfully connected with the database \n${dbUrl}`,
    badge: true,
  });

  success({
    message: `Server is running on \n${process.env.PORT}`,
    badge: true,
  });
});
