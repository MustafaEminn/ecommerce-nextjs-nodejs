"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config");

// exports the middleware
const authorize = () => (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    jwt.verify(token.split(" ")[1], config.secret, (err, verified) => {
      if (err) {
        res.status(401).send(err);
      } else {
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token not found." });
  }
};

module.exports = authorize;
