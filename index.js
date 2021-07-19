const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
dotenv.config();

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));

//Application Route
app.use("/todo", todoHandler);
app.use("/user", userHandler);

//default Error handler
const error = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
  }
  res.status(500).json({ Error: err });
};
app.use(error);
//Port listen
app.listen(3000, () => {
  console.log("server run in 3000 port");
});
