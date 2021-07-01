"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const { default: jwtDecode } = require("jwt-decode");
const nodemailer = require("nodemailer");
const sql = require("mssql");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

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
  ('${uid.stamp(10)}',
  '${body["title"]}',
  '${body["details"]}',
  '${JSON.stringify(body["photos"])}',
  '${new Date(Date.now()).toISOString()}',
  '${body["isActive"]}')`;

  await request.query(setProductQuery, async (err, record) => {
    if (err) {
      await body["photos"].map((item) => {
        fs.unlinkSync(path.resolve("images/" + item));
      });
      console.log(err);
      res.status(500).send({ code: 1, message: "Product could not created." });
    } else {
      res.status(200).send({ code: 2, message: "Product created." });
    }
  });
};

exports.deleteProduct = async (req, res, next) => {
  var request = new sql.Request();
  const deleteProductQuery = `DELETE FROM Products WHERE id='${req.params.id}'`;

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
  title = '${body["title"]}',
  details = '${body["details"]}',
  photos = '${JSON.stringify(body["photos"])}',
  isActive = '${body["isActive"]}' WHERE id = '${body["id"]}'`;

  await request.query(putProductQuery, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Product could not updated." });
    } else {
      res.status(200).send({ code: 2, message: "Product updated." });
    }
  });
};

exports.getProductsNewest = async (req, res, next) => {
  var request = new sql.Request();

  const getNewestProductsQuery = `SELECT INTO * FROM Products`;

  await request.query(getNewestProductsQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Products could not got." });
    } else {
      res.status(200).send({ code: 2, message: "Products got." });
    }
  });
};

exports.getProductsTop = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const getTopProductsQuery = `SELECT TOP ${body["count"]} * FROM Products ORDER BY createdAt DESC`;

  await request.query(getTopProductsQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Products could not got." });
    } else {
      res
        .status(200)
        .send({ code: 2, message: "Products getted.", products: resBody });
    }
  });
};
