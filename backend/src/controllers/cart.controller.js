"use strict";
const sql = require("mssql");
const config = require("../config");
const bcrypt = require("bcrypt-nodejs");
const async = require("async");

const { default: jwtDecode } = require("jwt-decode");

exports.addItem = async (req, res, next) => {
  var request = new sql.Request();
  const body = req.body;
  const decodedJWT = jwtDecode(req.headers.authorization);
  const getCartQuery = `SELECT * FROM Carts WHERE userId='${decodedJWT.userId}'`;
  const addItemQuery = `INSERT INTO Carts (userId,cart) VALUES
   ('${decodedJWT.userId}',
  '${JSON.stringify([
    { productId: body.productId, count: body.count, checked: body.checked },
  ])}')`;

  request.query(getCartQuery, (err, recordset) => {
    if (err) {
      return res
        .status(500)
        .send({ code: 1, message: "We got error when getting cart." });
    }
    const resBody = recordset.recordset;
    console.log(resBody);
    if (resBody[0]) {
      const decodeBody = JSON.parse(resBody[0]["cart"]);
      var itemIsNew = true;
      var newCart = decodeBody.map((item) => {
        item.productId === body.productId ? (itemIsNew = false) : void 0;
        return item.productId === body.productId
          ? { productId: item.productId, count: item.count + body.count }
          : item;
      });
      if (itemIsNew) {
        newCart.push(body);
      }
      const updateQuery = `UPDATE Carts SET
     cart='${JSON.stringify(newCart)}' WHERE userId='${decodedJWT.userId}'`;
      request.query(updateQuery, (err, recordset) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ code: 2, message: "We got error when updating cart." });
        }
        res.status(200).send({ code: 3, message: "Cart  updated." });
      });
    } else {
      request.query(addItemQuery, (err, recordset) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ code: 2, message: "We got error when adding cart item." });
        }
        res.status(200).send({ code: 3, message: "Cart item  added." });
      });
    }
  });
};

exports.loginSetCart = async (req, res, next) => {
  var request = new sql.Request();
  const body = req.body;
  const decodedJWT = jwtDecode(req.headers.authorization);
  const getCartQuery = `SELECT * FROM Carts WHERE userId='${decodedJWT.userId}'`;
  const addItemQuery = `INSERT INTO Carts (userId,cart) VALUES
   ('${decodedJWT.userId}',
  '${JSON.stringify(body["cart"])}')`;

  request.query(getCartQuery, (err, recordset) => {
    if (err) {
      return res
        .status(500)
        .send({ code: 1, message: "We got error when getting cart." });
    }
    const resBody = recordset.recordset;
    if (resBody[0]) {
      var decodedBody = JSON.parse(resBody[0]["cart"]);
      var decodedNewCart = JSON.parse(body["cart"]);
      const diffirent = decodedNewCart.filter(
        ({ productId: id1 }) =>
          !decodedBody.some(({ productId: id2 }) => id2 === id1)
      );
      const newCart = [...decodedBody, ...diffirent];
      const updateQuery = `UPDATE Carts SET
     cart='${JSON.stringify(newCart)}' WHERE userId='${decodedJWT.userId}'`;
      request.query(updateQuery, (err, recordset) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ code: 2, message: "We got error when updating cart." });
        }
        res.status(200).send({ code: 3, message: "Cart  updated." });
      });
    } else {
      request.query(addItemQuery, (err, recordset) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ code: 2, message: "We got error when adding cart item." });
        }
        res.status(200).send({ code: 3, message: "Cart item  added." });
      });
    }
  });
};

exports.getCart = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedJWT = jwtDecode(token);
  var request = new sql.Request();

  const getCartQuery = `SELECT * FROM Carts WHERE userId='${decodedJWT.userId}'`;

  await request.query(getCartQuery, async (err, record) => {
    if (err) {
      return res.status(500).send({ code: 1, message: "Cart could not got." });
    }

    const resbody = record.recordset[0];

    if (resbody) {
      const decodedBody = JSON.parse(resbody.cart);

      const getCartItem = async (cartItem) => {
        const getCartItemQuery = `SELECT * FROM Products WHERE id='${cartItem.productId}'`;
        return await request
          .query(getCartItemQuery)
          .then((res) => {
            return res.recordset[0] ? res.recordset[0] : null;
          })
          .catch((err) => {
            res.status(500).send({
              code: 2,
              message: "We got error when getting cart item.",
            });
          });
      };

      var cart = [];
      var index = 0;
      for await (const cartItem of decodedBody.map((e) => getCartItem(e))) {
        if (cartItem) {
          const decodedPhotos = JSON.parse(cartItem.photos);

          cart.push({
            ...cartItem,
            photos: decodedPhotos,
            count: decodedBody[index].count,
            checked: decodedBody[index].checked,
          });
        }
        console.log(cartItem);
        index++;
      }

      res.status(200).send({ code: 3, message: "Cart got.", cart: cart });
    } else {
      res
        .status(200)
        .send({ code: 4, message: "Cart got  but empty.", cart: [] });
    }
  });
};

exports.getCartLength = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedJWT = jwtDecode(token);
  var request = new sql.Request();

  const getCartQuery = `SELECT * FROM Carts WHERE userId='${decodedJWT.userId}'`;

  await request.query(getCartQuery, async (err, record) => {
    if (err) {
      return res.status(500).send({ code: 1, message: "Cart could not got." });
    }

    const resbody = record.recordset[0];
    if (resbody) {
      const cart = JSON.parse(resbody.cart);

      res
        .status(200)
        .send({ code: 3, message: "Cart got.", length: cart.length });
    } else {
      res.status(200).send({ code: 3, message: "Cart got.", length: 0 });
    }
  });
};

exports.getCartWithoutLogin = async (req, res, next) => {
  var request = new sql.Request();

  const decodedBody = JSON.parse(req.params.cart);

  const getCartItem = async (cartItem) => {
    const getCartItemQuery = `SELECT * FROM Products WHERE id='${cartItem.productId}'`;
    return await request
      .query(getCartItemQuery)
      .then((res) => {
        return res.recordset[0] ? res.recordset[0] : null;
      })
      .catch((err) => {
        res.status(500).send({
          code: 2,
          message: "We got error when getting cart item.",
        });
      });
  };

  var cart = [];
  var index = 0;
  for await (const cartItem of decodedBody.map((e) => getCartItem(e))) {
    if (cartItem) {
      const decodedPhotos = JSON.parse(cartItem.photos);

      cart.push({
        ...cartItem,
        photos: decodedPhotos,
        count: decodedBody[index].count,
        checked: decodedBody[index].checked,
      });
    }

    index++;
  }

  res.status(200).send({ code: 3, message: "Cart got.", cart: cart });
};

exports.deleteCart = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedJWT = jwtDecode(token);
  var request = new sql.Request();

  const getCartQuery = `SELECT * FROM Carts WHERE userId='${decodedJWT.userId}'`;

  await request.query(getCartQuery, async (err, record) => {
    if (err) {
      return res.status(500).send({ code: 1, message: "Cart could not got." });
    }

    const resbody = record.recordset[0];

    if (resbody) {
      const decodedBody = JSON.parse(resbody.cart);
      const newCart = decodedBody.filter((item) => {
        return item.productId !== req.params.productId;
      });

      const deleteCartItemQuery = `UPDATE Carts SET
        cart='${JSON.stringify(newCart)}' WHERE userId='${decodedJWT.userId}'`;
      request
        .query(deleteCartItemQuery)
        .then(() => {
          return res
            .status(200)
            .send({ code: 3, message: "Cart item deleted." });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({
            code: 2,
            message: "We got error when deleting cart item.",
          });
        });
    } else {
      res.status(200).send({ code: 4, message: "Cart got  but empty." });
    }
  });
};

exports.updateCount = async (req, res, next) => {
  const body = req.body;
  const decodedJWT = jwtDecode(req.headers.authorization);
  var request = new sql.Request();

  const getCart = `SELECT cart FROM Carts WHERE userId='${decodedJWT.userId}'`;

  request.query(getCart, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Update failed try again." });
    } else {
      const resBody = record.recordset[0].cart;
      const decodedBody = JSON.parse(resBody);
      const newCart = decodedBody.map((item) => {
        return item.productId === body["productId"]
          ? { ...item, count: body["count"] }
          : item;
      });
      const updateCartQuery = `UPDATE Carts SET
      cart='${JSON.stringify(newCart)}'
      WHERE userId='${decodedJWT.userId}'`;
      request
        .query(updateCartQuery)
        .then(() => {
          res.status(200).send({ code: 2, message: "Updated." });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .send({ code: 1, message: "Update failed try again." });
        });
    }
  });
};

exports.updateChecked = async (req, res, next) => {
  const body = req.body;
  const decodedJWT = jwtDecode(req.headers.authorization);
  var request = new sql.Request();

  const getCart = `SELECT cart FROM Carts WHERE userId='${decodedJWT.userId}'`;

  request.query(getCart, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Update failed try again." });
    } else {
      const resBody = record.recordset[0].cart;
      const decodedBody = JSON.parse(resBody);
      const newCart = decodedBody.map((item) => {
        return item.productId === body["productId"]
          ? { ...item, checked: body["checked"] }
          : item;
      });
      const updateCartQuery = `UPDATE Carts SET
      cart='${JSON.stringify(newCart)}'
      WHERE userId='${decodedJWT.userId}'`;
      request
        .query(updateCartQuery)
        .then(() => {
          res.status(200).send({ code: 2, message: "Updated." });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .send({ code: 1, message: "Update failed try again." });
        });
    }
  });
};
