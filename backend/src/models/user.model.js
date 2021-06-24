"use strict";
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");
const bcrypt = require("bcrypt-nodejs");
const config = require("../config");
const sql = require("mssql");

const roles = ["user", "admin"];

exports.register = () => {};
