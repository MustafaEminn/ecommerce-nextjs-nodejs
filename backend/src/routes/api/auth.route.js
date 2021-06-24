"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/authorization");

router.post("/register", authController.register); // validate and register
router.post("/login", authController.login);
router.post("/checkEmail", authController.checkEmail);
router.post("/checkUsername", authController.checkUsername);
router.post("/toggleLike", authController.toggleLike);
router.post("/checkLike", authController.checkLike);
router.post("/toggleBookmark", authController.toggleBookmark);
router.post("/checkBookmark", authController.checkBookmark);
router.post("/toggleFollow", authController.toggleFollow);
router.post("/checkFollow", authController.checkFollow);
router.get("/getUsername/:id", authController.getUsername);
router.post("/getUser", auth(), authController.getUser);
router.post("/getUserOnUsername", auth(), authController.getUserOnUsername);
router.post("/authCheck", auth(), (req, res) => {
  res.status(200).send({ success: true });
});
// router.get("/secret2", auth(["admin"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only admin can access" });
// });
// router.get("/secret3", auth(["user"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only user can access" });
// });

module.exports = router;
