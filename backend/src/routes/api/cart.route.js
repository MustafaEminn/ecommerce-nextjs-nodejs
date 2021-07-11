"use strict";

const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cart.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");

router.post("/addItem", auth(), cartController.addItem);
router.post("/loginSetCart", auth(), cartController.loginSetCart);

router.put("/updateCount", auth(), cartController.updateCount);
router.put("/updateChecked", auth(), cartController.updateChecked);
router.put("/updateApproved", auth(), cartController.updateApproved);

router.get("/getCart", auth(), cartController.getCart);
router.get("/getCartApproved", auth(), cartController.getCartApproved);
router.get("/getCartLength", auth(), cartController.getCartLength);
router.get("/getCartWithoutLogin/:cart", cartController.getCartWithoutLogin);

router.delete("/deleteCart/:productId", auth(), cartController.deleteCart);
// router.get("/getMemberById/:id", auth(), membersController.getMemberById);
// router.get("/getMemberByName/:name", auth(), membersController.getMemberByName);
// router.get(
//   "/getMemberByEmail/:email",
//   auth(),
//   membersController.getMemberByEmail
// );

// router.put("/updateMember", auth(), membersController.updateMember);
// router.put("/updatePassword", auth(), membersController.updatePassword);

// router.delete(
//   "/deleteMember/:id",
//   [auth(), checkRoles("admin")],
//   membersController.deleteMember
// );

module.exports = router;
