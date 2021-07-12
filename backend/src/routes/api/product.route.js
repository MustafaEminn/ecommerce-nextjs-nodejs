"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");

router.post(
  "/addProduct",
  [auth(), checkRoles("admin")],
  productController.addProduct
);
router.post("/getProductsTop", productController.getProductsTop);
router.post(
  "/getProductsTopForAdmin",
  [auth(), checkRoles("admin")],
  productController.getProductsTopForAdmin
);
router.put(
  "/updateProduct",
  [auth(), checkRoles("admin")],
  productController.updateProduct
);
router.delete(
  "/deleteProduct/:id",
  [auth(), checkRoles("admin")],
  productController.deleteProduct
);

router.get("/getProductById/:id", productController.getProductById);
router.get(
  "/getProductsMostSell/:count",
  productController.getProductsMostSell
);
router.get(
  "/getProductsPageByPage/:category/:page",
  productController.getProductsPageByPage
);

module.exports = router;
