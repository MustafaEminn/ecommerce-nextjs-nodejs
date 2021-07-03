"use strict";

const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");

router.get(
  "/getOrders/:page",
  [auth(), checkRoles("admin")],
  orderController.getOrders
);
router.get("/getOrderById/:id", auth(), orderController.getOrderById);

router.post(
  "/addOrder",
  [auth(), checkRoles("admin")],
  orderController.addOrder
);

router.put(
  "/updateOrder",
  [auth(), checkRoles("admin")],
  orderController.updateOrder
);
// router.get("/getMembersTop/:count", auth(), membersController.getMembersTop);
// router.get("/getMemberById/:id", auth(), membersController.getMemberById);
// router.get("/getMemberByName/:name", auth(), membersController.getMemberByName);
// router.get(
//   "/getMemberByEmail/:email",
//   auth(),
//   membersController.getMemberByEmail
// );

// router.put(
//   "/updateMember",
//   [auth(), checkRoles("admin")],
//   membersController.updateMember
// );

// router.delete(
//   "/deleteMember/:id",
//   [auth(), checkRoles("admin")],
//   membersController.deleteMember
// );

module.exports = router;
