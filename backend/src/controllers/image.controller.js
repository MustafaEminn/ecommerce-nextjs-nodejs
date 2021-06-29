"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const { default: jwtDecode } = require("jwt-decode");
const nodemailer = require("nodemailer");
const sql = require("mssql");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

exports.addImage = async (req, res, next) => {
  if (req.file) {
    res.json(req.file);
  } else throw "error";
};
exports.getImage = async (req, res, next) => {
  var imagePath = path.resolve("images/" + req.params.image);
  var imageExists = fs.existsSync(imagePath);
  if (imageExists) {
    res.sendFile(path.resolve("images/" + req.params.image));
  } else {
    res.redirect(config.clientUrl);
  }
};

exports.deleteImage = async (req, res, next) => {
  var imagePath = path.resolve("images/" + req.params.image);
  var imageExists = fs.existsSync(imagePath);
  if (imageExists) {
    fs.unlink(path.resolve("images/" + req.params.image), (err) => {
      if (err) {
        res
          .status(500)
          .json({ code: 1, message: "Got error when deleting image." });
      } else {
        res.status(200).json({ code: 2, message: "Image deleted." });
      }
    });
  } else {
    res.status(500).json({ code: 3, message: "Image not found." });
  }
};
