"use strict";

const config = require("../config");
const path = require("path");
const fs = require("fs");

exports.addImage = async (req, res, next) => {
  if (req.files["productPhoto"]) {
    res.status(200).send({
      code: 1,
      message: "Image updated.",
      imageName: req.files["productPhoto"][0].filename,
    });
  } else {
    res.status(500).send({ code: 2, message: "Image cannot updated." });
  }
};
exports.getImage = async (req, res, next) => {
  var imagePath = path.resolve("images/" + req.params.image);
  var imageExists = fs.existsSync(imagePath);
  if (imageExists) {
    res.sendFile(imagePath);
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
