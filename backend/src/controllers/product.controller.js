"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt-nodejs");
const sql = require("mssql");
const fs = require("fs");
const path = require("path");

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
  '${body["isActive"]}',
  '${body["price"]}',
  '${body["sellCount"]}',
  '${body["category"]}',
  '${JSON.stringify(body["categoryAdmin"])}'
  )`;

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
  const getCarts = `SELECT * FROM Carts`;

  await request.query(deleteProductQuery, async (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Product could not deleted." });
    } else {
      await request.query(getCarts, async (err, record) => {
        if (err) {
          return console.log(err);
        }
        const carts = record.recordset;
        for (const item of carts) {
          const decodedCart = JSON.parse(item.cart);

          const newCart = await Promise.all(
            decodedCart.filter((item2) => {
              return item2.productId !== req.params.id;
            })
          );

          const setNewCartQuery = `UPDATE Carts SET cart='${JSON.stringify(
            newCart
          )}' WHERE userId='${item.userId}'`;
          await request.query(setNewCartQuery, (err, record) => {
            if (err) {
              console.log(err);
            }
            return;
          });
        }
      });

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
  isActive = '${body["isActive"]}',
  price = '${body["price"]}',
  sellCount = '${body["sellCount"]}',
  category =  '${body["category"]}',
  categoryAdmin =  '${JSON.stringify(body["categoryAdmin"])}'
  WHERE id = '${body["id"]}'
  `;

  await request.query(putProductQuery, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Product could not updated." });
    } else {
      res.status(200).send({ code: 2, message: "Product updated." });
    }
  });
};

exports.getProductsPageByPage = async (req, res, next) => {
  var request = new sql.Request();

  var numPerPage = 50;
  var skip = (req.params.page - 1) * numPerPage;
  request.query(
    `SELECT count(*) as numRows FROM Products WHERE category='${req.params.category}'`,
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        res.status(500).send({ code: 1, message: "Products count not got." });
      } else {
        console.log(rows.recordset);
        var numRows = rows.recordset[0].numRows;
        var countPage = Math.ceil(numRows / numPerPage);
        request.query(
          `SELECT * FROM Products WHERE category='${req.params.category}' ORDER BY createdAt DESC OFFSET ${skip} ROWS FETCH NEXT ${numPerPage} ROWS ONLY`,
          function (err, rows, fields) {
            if (err) {
              console.log("error: ", err);
              res.status(500).send({ code: 2, message: "Products not got." });
            } else {
              var resData = rows.recordsets[0];
              var decodedData = resData.map((item) => {
                return { ...item, photos: JSON.parse(item.photos) };
              });
              res.status(200).send({
                code: 3,
                message: "Products got.",
                products: decodedData,
                countOfPages: countPage,
              });
            }
          }
        );
      }
    }
  );
};

exports.getProductById = async (req, res, next) => {
  var request = new sql.Request();

  const getProductQuery = `SELECT * FROM Products WHERE id= '${req.params.id}'`;

  await request.query(getProductQuery, (err, record) => {
    var resBody = record.recordset;
    if (err) {
      res
        .status(500)
        .send({ code: 1, message: "We got error when product getting." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Product not found." });
    } else {
      res.status(200).send({
        code: 3,
        message: "Products getted.",
        product: resBody,
      });
    }
  });
};

exports.getProductsMostSell = async (req, res, next) => {
  var request = new sql.Request();
  const getProductsQuery = `SELECT TOP ${req.params.count} * FROM Products WHERE isActive=1 ORDER BY sellCount DESC`;

  await request.query(getProductsQuery, (err, record) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send({ code: 1, message: "We got error when products getting." });
    }
    var resBody = record.recordset;

    if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Products not found." });
    } else {
      res.status(200).send({
        code: 3,
        message: "Products getted.",
        products: resBody,
      });
    }
  });
};

exports.getProductsTopForAdmin = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const getTopProductsQuery = `SELECT TOP ${body["count"]} * FROM Products ORDER BY createdAt DESC`;

  await request.query(getTopProductsQuery, (err, record) => {
    var resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Products could not got." });
    } else {
      resBody.map((item, index) => {
        return (resBody[index]["categoryAdmin"] = JSON.parse(
          resBody[index]["categoryAdmin"]
        ));
      });
      res
        .status(200)
        .send({ code: 2, message: "Products getted.", products: resBody });
    }
  });
};

exports.getProductsTop = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const getTopProductsQuery = `SELECT TOP ${body["count"]} * FROM Products WHERE isActive=1 ORDER BY createdAt DESC`;

  await request.query(getTopProductsQuery, (err, record) => {
    var resBody = record.recordset;
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
