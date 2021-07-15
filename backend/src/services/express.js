"use strict";

const config = require("../config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const errorHandler = require("../middlewares/error-handler");
const apiRouter = require("../routes/api");
const passport = require("passport");

const app = express();
app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.json({ extended: true, limit: "20mb" }));
app.use(cors());
app.use(helmet());

if (config.env !== "test") app.use(morgan("combined"));

// passport
app.use(passport.initialize());

app.use("/api", apiRouter);
app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

exports.start = () => {
  app.listen(config.port, (err) => {
    if (err) {
      console.log(`Error : ${err}`);
      process.exit(-1);
    }

    console.log(`Running on ${config.port}`);
  });
};

exports.app = app;
