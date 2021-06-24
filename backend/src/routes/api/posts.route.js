"use strict";

const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/posts.controller");
const auth = require("../../middlewares/authorization");

router.post("/postsCreate", auth(), postsController.createPost);
router.post("/addLike", auth(), postsController.addLike);
router.post("/addComment", auth(), postsController.addComment);
router.post("/checkPostAdmin", auth(), postsController.checkPostAdmin);
router.post("/deletePost", auth(), postsController.deletePost);
router.post("/getUserPost", auth(), postsController.getUserPost);
router.post("/getPostOnId", auth(), postsController.getPostOnId);
router.get("/getAll", postsController.getAllPost);

module.exports = router;
