"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const sql = require("mssql");
const fs = require("fs");
const path = require("path");

exports.setCategories = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const putCategoriesQuery = `UPDATE Categories SET 
  categories = '${JSON.stringify(body["categories"])}'
  `;

  await request.query(putCategoriesQuery, (err, record) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send({ code: 1, message: "Categories could not updated." });
    } else {
      res.status(200).send({ code: 2, message: "Categories updated." });
    }
  });
};

exports.getCategories = async (req, res, next) => {
  var request = new sql.Request();

  const getQuery = `SELECT categories FROM Categories`;

  await request.query(getQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      res
        .status(500)
        .send({ code: 1, message: "We got error when categories getting." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Categories not found." });
    } else {
      const categoriesDecoded = JSON.parse(resBody[0].categories);
      res.status(200).send({
        code: 3,
        message: "Categories getted.",
        categories: categoriesDecoded,
      });
    }
  });
};
