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
  '${JSON.stringify([{ productId: body.productId, count: body.count }])}')`;

  request.query(getCartQuery, (err, recordset) => {
    if (err) {
      return res
        .status(500)
        .send({ code: 1, message: "We got error when getting cart." });
    }
    const resBody = recordset.recordset;
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
            return res.recordset[0];
          })
          .catch((err) => {
            return res.status(500).send({
              code: 2,
              message: "We got error when getting cart item.",
            });
          });
      };

      var cart = [];
      var index = 0;
      for await (const cartItem of decodedBody.map((e) => getCartItem(e))) {
        const decodedPhotos = JSON.parse(cartItem.photos);

        cart.push({
          ...cartItem,
          photos: decodedPhotos,
          count: decodedBody[index].count,
          checked: decodedBody[index].checked,
        });
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
      console.log(newCart);

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

// exports.updatePassword = async (req, res, next) => {
//   const body = req.body;
//   var request = new sql.Request();
//   var decodedJWT = jwtDecode(req.headers.authorization);
//   const oldPass = bcrypt.hashSync(body["oldPassword"], config.hashKey);
//   const newPass = bcrypt.hashSync(body["newPassword"], config.hashKey);
//   const getPasswordQuery = `SELECT Password FROM Users WHERE id = '${decodedJWT.userId}'`;
//   const updateMember = `UPDATE Users SET
//   Password='${newPass}'
//   WHERE id='${decodedJWT["userId"]}'`;

//   request.query(getPasswordQuery, (err, record) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send({ code: 1, message: "Update failed try again." });
//     } else {
//       const resBody = record.recordset[0];
//       if (resBody.Password === oldPass) {
//         request.query(updateMember, (err, record) => {
//           if (err) {
//             console.log(err);
//             res
//               .status(500)
//               .send({ code: 1, message: "Update failed try again." });
//           } else {
//             res.status(200).send({ code: 2, message: "Updated." });
//           }
//         });
//       } else {
//         res.status(500).send({ code: 3, message: "Password not correct." });
//       }
//     }
//   });
// };

// exports.getMembersNewest = async (req, res, next) => {
//   var request = new sql.Request();

//   const getNewestProductsQuery = `SELECT * FROM Products`;

//   await request.query(getNewestProductsQuery, (err, record) => {
//     if (err) {
//       res.status(500).send({ code: 1, message: "Products could not got." });
//     } else {
//       res.status(200).send({ code: 2, message: "Products got." });
//     }
//   });
// };

// exports.getMembersTop = async (req, res, next) => {
//   var request = new sql.Request();

//   const getTopMembersQuery = `SELECT TOP ${req.params.count} * FROM Users ORDER BY createdAt DESC`;

//   await request.query(getTopMembersQuery, (err, record) => {
//     const resBody = record.recordset;
//     if (err) {
//       console.log(err);
//       res.status(500).send({ code: 1, message: "Members could not got." });
//     } else {
//       res
//         .status(200)
//         .send({ code: 2, message: "Members getted.", members: resBody });
//     }
//   });
// };

// exports.getMemberById = async (req, res, next) => {
//   var request = new sql.Request();

//   const getMemberQuery = `SELECT * FROM Users WHERE id= '${req.params.id}'`;

//   await request.query(getMemberQuery, (err, record) => {
//     const resBody = record.recordset;
//     if (err) {
//       console.log(err);
//       res.status(500).send({ code: 1, message: "Member could not got." });
//     } else if (!resBody[0]) {
//       res.status(500).send({ code: 2, message: "Member not found." });
//     } else {
//       res
//         .status(200)
//         .send({ code: 3, message: "Member got.", member: resBody });
//     }
//   });
// };

// exports.getMemberByEmail = async (req, res, next) => {
//   var request = new sql.Request();

//   const getMemberQuery = `SELECT * FROM Users WHERE email= '${req.params.email}'`;

//   await request.query(getMemberQuery, (err, record) => {
//     const resBody = record.recordset;
//     if (err) {
//       console.log(err);
//       res.status(500).send({ code: 1, message: "Member could not got." });
//     } else if (!resBody[0]) {
//       res.status(500).send({ code: 2, message: "Member not found." });
//     } else {
//       res
//         .status(200)
//         .send({ code: 3, message: "Member got.", member: resBody });
//     }
//   });
// };

// exports.getMemberByName = async (req, res, next) => {
//   var request = new sql.Request();
//   const paramsName = req.params.name.split(" ");
//   var name = "";
//   var surname = "";
//   paramsName.map((item, index) => {
//     if (paramsName.length > 1) {
//       return index !== paramsName.length - 1
//         ? (name += item + " ")
//         : (surname += item);
//     } else {
//       name += item;
//       surname += item;
//     }
//   });

//   const getMemberQuery = `SELECT CONCAT(Name, ' ', Surname) AS NameFull,* FROM Users WHERE Name = '${name}' OR Surname = '${surname}'`;

//   await request.query(getMemberQuery, (err, record) => {
//     console.log(record);
//     const resBody = record.recordset;

//     if (err) {
//       console.log(err);
//       res.status(500).send({ code: 1, message: "Member could not got." });
//     } else if (!resBody[0]) {
//       res.status(500).send({ code: 2, message: "Member not found." });
//     } else {
//       res
//         .status(200)
//         .send({ code: 3, message: "Member got.", member: resBody });
//     }
//   });
// };

// exports.deleteMember = async (req, res, next) => {
//   var request = new sql.Request();
//   const deleteMemberQuery = `DELETE FROM Users WHERE id='${req.params.id}'`;

//   await request.query(deleteMemberQuery, (err, record) => {
//     if (err) {
//       res.status(500).send({ code: 1, message: "Member could not deleted." });
//     } else {
//       res.status(200).send({ code: 2, message: "Member deleted." });
//     }
//   });
// };
