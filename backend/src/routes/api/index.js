"use strict";
const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const imageRouter = require("./image.route");
const memberRouter = require("./members.route");
const orderRouter = require("./order.route");
const cartRouter = require("./cart.route");
const categoryRouter = require("./category.route");

router.get("/status", (req, res) => {
  res.send({ status: "OK" });
}); // api status

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/img", imageRouter);
router.use("/member", memberRouter);
router.use("/order", orderRouter);
router.use("/cart", cartRouter);
router.use("/category", categoryRouter);

module.exports = router;
