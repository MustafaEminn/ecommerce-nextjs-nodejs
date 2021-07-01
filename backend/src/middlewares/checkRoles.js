"use strict";

const { default: jwtDecode } = require("jwt-decode");

const checkRoles =
  (role = "") =>
  (req, res, next) => {
    const decoded = jwtDecode(req.headers.authorization.split(" ")[1]);
    const roles = decoded.roles;
    const hasRole = roles.includes(role);

    if (!hasRole) {
      res.status(500).send({
        code: 1000,
        message: "This service required admin permission.",
      });
    } else {
      next();
    }
  };

module.exports = checkRoles;
