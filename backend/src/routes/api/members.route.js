"use strict";

const express = require("express");
const router = express.Router();
const membersController = require("../../controllers/members.controller");
const auth = require("../../middlewares/authorization");
const checkRoles = require("../../middlewares/checkRoles");

router.get("/getMembersTop/:count", auth(), membersController.getMembersTop);
router.get("/getMemberById/:id", auth(), membersController.getMemberById);
router.get("/getMemberByName/:name", auth(), membersController.getMemberByName);
router.get(
  "/getMemberByEmail/:email",
  auth(),
  membersController.getMemberByEmail
);

router.put(
  "/updateMember",
  [auth(), checkRoles("admin")],
  membersController.updateMember
);

router.delete(
  "/deleteMember/:id",
  [auth(), checkRoles("admin")],
  membersController.deleteMember
);

module.exports = router;
