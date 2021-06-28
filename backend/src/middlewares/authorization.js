"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config");

// exports the middleware
const authorize = () => (req, res, next) => {
  let token = req.header("Authorization").split(" ")[1];
  jwt.verify(token, config.secret, (err, verified) => {
    if (err) {
      res.status(401).send(err);
    } else {
      next();
    }
  });
};

module.exports = authorize;
