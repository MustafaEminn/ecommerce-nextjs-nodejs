"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const auth = require("../../middlewares/authorization");

router.post("/addProduct", auth(), productController.addProduct);
router.post("/getProductsTop", productController.getProductsTop);
// router.get("/secret2", auth(["admin"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only admin can access" });
// });
// router.get("/secret3", auth(["user"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only user can access" });
// });

module.exports = router;
