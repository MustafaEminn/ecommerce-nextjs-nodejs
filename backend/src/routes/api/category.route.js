"use strict";

const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");

router.put(
  "/setCategories",
  [auth(), checkRoles("admin")],
  categoryController.setCategories
);
router.get("/getCategories", categoryController.getCategories);

module.exports = router;
