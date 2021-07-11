"use strict";
const { default: jwtDecode } = require("jwt-decode");
const sql = require("mssql");
const ShortUniqueId = require("short-unique-id");

//Order Status
//1: pneding approval
//2: approved
//3: shipped
//4: ship has been delivered

//100: Rejected
//101: order canceled

//Ship Company
//0: Null
//1: Aras
//2: Yurtiçi
//3: Sürat
//4: Ptt
//5: Mng
//6: Ups
exports.addOrder = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();
  const uid = new ShortUniqueId();
  const token = req.headers.authorization;
  const decodedJWT = jwtDecode(token);
  const setOrderQuery = `INSERT INTO Orders (id,buyerId,orderShippingAddress,orderBillingAddress,orderStatus,productId,buyAt,shippingCompany,price,invitation,count) VALUES 
  ('${uid.stamp(12)}',
  '${decodedJWT.userId}',
  '${JSON.stringify(body["orderShippingAddress"])}',
  '${JSON.stringify(body["orderBillingAddress"])}',
  '${body["orderStatus"]}',
  '${body["productId"]}',
  '${new Date(Date.now()).toISOString()}',
  '0',
  '${body["price"]}',
  '${JSON.stringify(body["invitation"])}',
  '${body["count"]}'
  )`;

  await request.query(setOrderQuery, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Order could not created." });
    } else {
      res.status(200).send({ code: 2, message: "Order created." });
    }
  });
};

exports.updateOrder = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const shippingBeginAt = body["shippingBeginAt"]
    ? `shippingBeginAt='${body["shippingBeginAt"]}'`
    : "shippingBeginAt=NULL";
  const shippingEndAt = body["shippingEndAt"]
    ? `shippingEndAt='${body["shippingEndAt"]}'`
    : "shippingEndAt=NULL";

  const updateOrder = `UPDATE Orders SET 
  orderShippingAddress='${body["orderShippingAddress"]}',
  orderBillingAddress='${body["orderBillingAddress"]}',
  orderStatus='${body["orderStatus"]}',
  price='${body["price"]}',
  ${shippingBeginAt},
  ${shippingEndAt},
  shippingCompany='${body["shippingCompany"] || null}',
  shippingTrackId='${body["shippingTrackId"] || null}'
  WHERE id='${body["id"]}'`;

  await request.query(updateOrder, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Update failed try again." });
    } else {
      res.status(200).send({ code: 2, message: "Updated." });
    }
  });
};

exports.getOrders = async (req, res, next) => {
  var request = new sql.Request();

  var numPerPage = 20;
  var skip = (req.params.page - 1) * numPerPage;
  request.query(
    "SELECT count(*) as numRows FROM Orders",
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        res.status(500).send({ code: 1, message: "Orders count not got." });
      } else {
        var numRows = rows.recordset[0].numRows;
        var countPage = Math.ceil(numRows / numPerPage);
        request.query(
          `SELECT * FROM Orders ORDER BY buyAt DESC OFFSET ${skip} ROWS FETCH NEXT ${numPerPage} ROWS ONLY`,
          function (err, rows, fields) {
            if (err) {
              console.log("error: ", err);
              res.status(500).send({ code: 2, message: "Orders not got." });
            } else {
              res.status(200).send({
                code: 3,
                message: "Orders got.",
                orders: rows.recordsets[0],
                countOfPages: countPage,
              });
            }
          }
        );
      }
    }
  );
};

exports.getOrdersAll = async (req, res, next) => {
  var request = new sql.Request();
  const token = req.headers.authorization;
  const decodedJWT = jwtDecode(token);
  const getOrderQuery = `SELECT * FROM Orders WHERE buyerId= '${decodedJWT.userId}'`;

  await request.query(getOrderQuery, (err, record) => {
    const resBody = record?.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Orders could not got." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Orders not found." });
    } else {
      res
        .status(200)
        .send({ code: 3, message: "Orders got.", orders: resBody });
    }
  });
};

exports.getOrderById = async (req, res, next) => {
  var request = new sql.Request();

  const getOrderQuery = `SELECT * FROM Orders WHERE id= '${req.params.id}'`;

  await request.query(getOrderQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Order could not got." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Order not found." });
    } else {
      res.status(200).send({ code: 3, message: "Order got.", order: resBody });
    }
  });
};
