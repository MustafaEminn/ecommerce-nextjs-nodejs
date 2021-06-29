"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const { default: jwtDecode } = require("jwt-decode");
const nodemailer = require("nodemailer");
const sql = require("mssql");
const crypto = require("crypto");

exports.login = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const getUserQuery = `SELECT Email,Password,id,Name,Surname FROM Users WHERE Email = '${body["email"]}'`;

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

exports.addProduct = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const uid = new ShortUniqueId();
  const setProductQuery = `INSERT INTO Products VALUES 
  ('${uid.stamp(5)}',
  '${body["title"]}',
  '${body["details"]}',
  '${body["photos"]}',)`;

  await request.query(setProductQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Product could not created." });
    } else {
      res.status(200).send({ code: 2, message: "Product created." });
    }
  });
};

exports.deleteProduct = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const deleteProductQuery = `DELETE FROM Products WHERE id='${body["id"]}'`;

  await request.query(deleteProductQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Product could not deleted." });
    } else {
      res.status(200).send({ code: 2, message: "Product deleted." });
    }
  });
};

exports.updateProduct = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const putProductQuery = `UPDATE Products SET 
  title = ${body["title"]},
  details = ${body["details"]},
  photos = ${body["photos"]};`;

  await request.query(putProductQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Product could not updated." });
    } else {
      res.status(200).send({ code: 2, message: "Product updated." });
    }
  });
};
