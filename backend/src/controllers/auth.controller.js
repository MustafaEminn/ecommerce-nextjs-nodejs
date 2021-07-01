"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");
const sql = require("mssql");
const crypto = require("crypto");

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
  '',
  '',
  '',
  '',
  '${newBody["phoneNumber"]}',
  '${newBody["id"]}',
  '${newBody["email"]}',
  '${newBody["gender"]}',
  '${JSON.stringify(["user"])}',
  '${new Date(Date.now()).toISOString()}')`;

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
  const getUserQuery = `SELECT Email,Password,id,Name,Surname,Roles FROM Users WHERE Email = '${body["email"]}'`;

  await request.query(getUserQuery, (err, record) => {
    const resBody = record.recordset[0];

    if (resBody) {
      const pass = bcrypt.hashSync(body["password"], config.hashKey);
      if (pass === resBody["Password"]) {
        const payload = {
          userId: resBody["id"],
          email: resBody["Email"],
          name: resBody["Name"],
          surname: resBody["Surname"],
          roles: JSON.parse(resBody["Roles"]),
        };
        const token = jwt.sign(payload, config.secret, { expiresIn: "1y" });
        res
          .status(200)
          .json({ code: 2, token: token, message: "Login successful." });
      } else {
        res
          .status(500)
          .send({ code: 1, message: "Email or password is wrong." });
      }
    } else {
      res.status(500).send({ code: 1, message: "Email or password is wrong." });
    }
  });
};

exports.checkAuth = async (req, res, next) => {
  return res.status(200).json({ message: "Account have auth." });
};

exports.resetPassword = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const getUserTokenQuery = `SELECT token FROM ResetPasswords WHERE id = '${body["id"]}'`;

  await request.query(getUserTokenQuery, (err, record) => {
    const resBody = record.recordset[0];
    const newPass = bcrypt.hashSync(body["password"], config.hashKey);
    const setUserNewPass = `UPDATE Users SET Password='${newPass}' WHERE id='${body["id"]}'`;
    const deleteResetToken = `DELETE FROM ResetPasswords WHERE id='${body["id"]}'`;

    if (resBody) {
      const token = bcrypt.hashSync(body["token"], config.hashKey);
      console.log(token);
      console.log(resBody["token"]);
      if (token === resBody["token"]) {
        request.query(setUserNewPass, (err, recordset) => {
          if (err) {
            res.status(500).json({
              code: 4,
              message: "We got error when updating password.",
            });
          } else {
            request.query(deleteResetToken, (err, recordset) => {});
            res.status(200).json({ code: 2, message: "Password updated." });
          }
        });
      } else {
        res.status(500).send({ code: 3, message: "Token can't verified." });
      }
    } else {
      console.log(1);
      res.status(500).send({ code: 1, message: "Token not found." });
    }
  });
};

exports.resetPasswordSendMail = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const getUserQuery = `SELECT id FROM Users WHERE Email = '${body["email"]}'`;

  await request.query(getUserQuery, async (err, record) => {
    const resBody = record.recordset[0];

    if (!resBody) {
      res
        .status(500)
        .send({ code: 1, message: "This email is not registered." });
    } else {
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = bcrypt.hashSync(resetToken, config.hashKey);
      const setUserResetTokenQuery = `INSERT INTO ResetPasswords VALUES ('${
        resBody["id"]
      }','${hash}','${new Date(Date.now()).toISOString()}')`;
      const deleteResetToken = `DELETE FROM ResetPasswords WHERE id='${resBody["id"]}'`;

      const refreshTokenUrl = `${config.clientUrl}/password-reset?token=${resetToken}&id=${resBody["id"]}`;

      await request.query(deleteResetToken);

      await request.query(setUserResetTokenQuery, async (err, record) => {
        if (err) {
          res.status(500).json({ code: 2, message: "Please try again." });
        } else {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: config.adminMail,
              pass: config.adminMailPass,
            },
          });

          // send mail with defined transport object
          await transporter.sendMail({
            from: `"EDavetiyecim" <${config.adminMail}>`, // sender address
            to: body["email"], // list of receivers
            subject: "EDavetiyecim Şifre Değiştirme Maili ✔", // Subject line
            text: "", // plain text body
            html: `<p>Merhaba,</p><b>Şifrenizi değiştirmek için aşağıdaki linke tıklayınız.</b><br/><a href="${refreshTokenUrl}">Lütfen şifrenizi sıfırlamak için buraya tıklayınız.</a>`, // html body
          });

          res.status(200).json({ code: 1, message: "Email sended." });
        }
      });
    }
  });
};
