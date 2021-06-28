"use strict";

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const { default: jwtDecode } = require("jwt-decode");
const sql = require("mssql");

exports.register = async (req, res, next) => {
  var request = new sql.Request();
  const body = req.body;
  const uid = new ShortUniqueId();
  const newBody = {
    ...body,
    password: bcrypt.hashSync(body.password, config.hashKey),
    id: uid.stamp(32),
  };

  const emailExistsQuery = `SELECT Email FROM Users WHERE Email = '${newBody["email"]}'`;
  const phonenumberExistsQuery = `SELECT PhoneNumber FROM Users WHERE PhoneNumber = '${newBody["phoneNumber"]}'`;
  const registerQuery = `INSERT INTO Users VALUES 
  ('${newBody["name"]}',
  '${newBody["surname"]}',
  '${newBody["password"]}',
  '${newBody["address"]}',
  '${newBody["city"]}',
  '${newBody["district"]}',
  '${newBody["neighborhood"]}',
  '${newBody["phoneNumber"]}',
  '${newBody["id"]}',
  '${newBody["email"]}',
  '${newBody["gender"]}')`;

  // Register
  // Error code 2 mean is already exists email
  // Error code 3 mean is already exists PhoneNumber
  await request.query(emailExistsQuery, async function (err, recordset) {
    if (err) {
      next(err);
    }
    if (recordset.recordset.length === 0) {
      await request.query(
        phonenumberExistsQuery,
        async function (err, recordset) {
          if (err) {
            next(err);
          }
          if (recordset.recordset.length === 0) {
            await request.query(registerQuery, function (err, recordset) {
              if (err) {
                next(err);
              } else {
                res.status(200).send({ message: "Account created." });
              }
            });
          } else {
            res
              .status(500)
              .send({ code: 3, message: "Phone number already taken." });
          }
        }
      );
    } else {
      res.status(500).send({ code: 2, message: "Email already taken." });
    }
  });
};

exports.login = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const getUserQuery = `SELECT Email,Password,id,Name,Surname FROM Users WHERE Email = '${body["email"]}'`;

  await request.query(getUserQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Email or password is wrong." });
    }
    const resBody = record.recordset[0];
    const pass = bcrypt.hashSync(body["password"], config.hashKey);
    if (pass === resBody["Password"]) {
      const payload = {
        userId: resBody["id"],
        email: resBody["Email"],
        name: resBody["Name"],
        surname: resBody["Surname"],
      };
      const token = jwt.sign(payload, config.secret, { expiresIn: "1y" });
      res
        .status(200)
        .json({ code: 2, token: token, message: "Login successful." });
    } else {
      res.status(500).send({ code: 1, message: "Email or password is wrong." });
    }
  });
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
