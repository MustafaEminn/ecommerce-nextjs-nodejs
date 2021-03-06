"use strict";

const express = require("express");
const router = express.Router();
const imageController = require("../../controllers/image.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");
const uploadMultiple = require("../../services/multer");

router.post(
  "/imageAdd",
  [auth(), checkRoles("admin"), uploadMultiple],
  imageController.addImage
);

router.get("/:image", imageController.getImage);

router.delete(
  "/:image",
  [auth(), checkRoles("admin")],
  imageController.deleteImage
);
// router.get("/secret2", auth(["admin"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only admin can access" });
// });
// router.get("/secret3", auth(["user"]), (req, res) => {
//   // example route for auth
//   res.json({ message: "Only user can access" });
// });

module.exports = router;
