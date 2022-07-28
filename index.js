const express = require("express");
var mongoose = require("./services/mongoose");
var app = express();
require("dotenv").config();
const router = require("./routes/user.router");
const { success, error } = require("consola");
app.use("/", router);
const dbUrl = process.env.DB_URL;

mongoose(dbUrl);
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
