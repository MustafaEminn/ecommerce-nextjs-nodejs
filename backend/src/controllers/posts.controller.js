"use strict";

const Posts = require("../models/posts.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt-nodejs");
const fs = require("fs");
const { default: jwtDecode } = require("jwt-decode");

exports.createPost = async (req, res, next) => {
  try {
    const body = req.body;
    const posts = new Posts(body);
    await posts.save();
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const posts = Posts.getAll();
    return res.status(200).send({ success: true, data: await posts });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.addLike = async (req, res, next) => {
  try {
    const { id, username } = req.body;
    const posts = Posts.addLike(id, username);
    return res.status(200).send({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { obId, message } = req.body;
    let auth = await req.headers.authorization;
    var jwtDecoded = await jwtDecode(auth);
    const name = jwtDecoded.username;
    const comment = Posts.addComment(obId, name, message);
    return res.status(200).send({ success: true, data: comment });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.checkPostAdmin = async (req, res, next) => {
  try {
    const { postID } = req.body;
    let auth = await req.headers.authorization;
    var jwtDecoded = await jwtDecode(auth);
    const postAdmin = await Posts.checkPostAdmin(postID, jwtDecoded.username);
    return res.status(200).send({ success: postAdmin });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    const { username } = req.body;
    const userPosts = Posts.getUserPost(username);
    return res.status(200).send({ success: true, data: await userPosts });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.getPostOnId = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userPost = Posts.getPostOnId(id);
    return res.status(200).send({ success: true, data: await userPost });
  } catch (error) {
    console.log(error);
    return res.send({ success: false });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedPost = Posts.deletePost(id);
    return res.status(200).send({ success: deletedPost });
  } catch (error) {
    res.send({ success: false });
    next(error);
  }
};
