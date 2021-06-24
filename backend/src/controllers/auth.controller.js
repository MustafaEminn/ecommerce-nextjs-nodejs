"use strict";

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt-nodejs");
const { default: jwtDecode } = require("jwt-decode");
const sql = require("mssql");

exports.register = async (req, res, next) => {
  try {
    const body = req.body;
    const newBody = {
      ...body,
      password: bcrypt.hashSync(body.password, config.hashKey),
    };

    var request = new sql.Request();

    var name = newBody["name"].replace(" ", "_");

    await request.query(
      `INSERT INTO [User] VALUES (${name},${newBody["surname"]},${newBody["password"]},
      ${newBody["address"]},${newBody["city"]},${newBody["district"]},${newBody["neighborhood"]})`,
      function (err, recordset) {
        if (err) next(err);

        // send records as a response
        res.send(recordset);
      }
    );
  } catch (error) {
    console.log(error);
    res.send({ success: false });
    return next(User.checkDuplicateEmailError(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body);
    if (user) {
      const payload = { sub: user.id, username: user.username };
      const token = jwt.sign(payload, config.secret, { expiresIn: "1d" });
      return res.send({ success: true, message: "OK", token: token });
    } else {
      res.send({ success: false });
    }
  } catch (error) {
    res.send({ success: false });
    next(error);
  }
};

exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findEmail(email);
    res.send({ success: user });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const { id, username } = req.body;
    const like = await User.toggleLike(username, id);
    res.send({ success: true, data: like });
  } catch (error) {
    console.log(error);
  }
};

exports.checkLike = async (req, res, next) => {
  try {
    const { id, username } = req.body;
    const like = await User.checkLike(username, id);
    res.send({ success: true, data: like });
  } catch (error) {
    console.log(error);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id, username } = req.body;
    const bookmark = await User.toggleBookmark(username, id);
    res.send({ success: true, data: bookmark });
  } catch (error) {
    console.log(error);
  }
};

exports.checkBookmark = async (req, res, next) => {
  try {
    const { id, username } = req.body;
    const bookmark = await User.checkBookmark(username, id);
    res.send({ success: true, data: bookmark });
  } catch (error) {
    console.log(error);
  }
};

exports.toggleFollow = async (req, res, next) => {
  try {
    const { usernamePost } = req.body;
    let auth = await req.headers.authorization;
    var jwtDecoded = await jwtDecode(auth);
    const follow = await User.toggleFollow(jwtDecoded.username, usernamePost);
    res.send({ success: true, data: follow });
  } catch (error) {
    console.log(error);
  }
};

exports.checkFollow = async (req, res, next) => {
  try {
    const { usernamePost } = req.body;
    let auth = await req.headers.authorization;
    var jwtDecoded = await jwtDecode(auth);
    const follow = await User.checkFollow(jwtDecoded.username, usernamePost);
    res.send({ success: true, data: follow });
  } catch (error) {
    console.log(error);
  }
};

exports.getUsername = async (req, res, next) => {
  try {
    const user = await User.findUsernameOnEmail(req.params.id);
    res.send({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let auth = await req.headers.authorization;
    var jwtDecoded = await jwtDecode(auth);
    const user = await User.findUsernameOnId(jwtDecoded.sub);
    res.send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getUserOnUsername = async (req, res, next) => {
  try {
    let { username } = req.body;
    const user = await User.findUserOnUsername(username);
    res.send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findUsername(username);
    res.send({ success: user });
  } catch (error) {
    next(error);
  }
};
