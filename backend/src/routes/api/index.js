"use strict";
const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const imageRouter = require("./image.route");

router.get("/status", (req, res) => {
  res.send({ status: "OK" });
}); // api status

router.use("/auth", authRouter); // mount auth paths
router.use("/product", productRouter); // mount auth paths
router.use("/img", imageRouter); // mount auth paths

module.exports = router;
