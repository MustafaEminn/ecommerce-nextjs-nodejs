"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/authorization");

router.post("/register", authController.register); // validate and register
router.post("/login", authController.login);
router.post("/resetPasswordSendMail", authController.resetPasswordSendMail);
router.put("/resetPassword", authController.resetPassword);
router.get("/checkAuth", auth(), authController.checkAuth);
// router.get("/secret2", auth(["admin"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only admin can access" });
// });
// router.get("/secret3", auth(["user"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only user can access" });
// });

module.exports = router;
