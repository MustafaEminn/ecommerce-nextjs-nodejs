"use strict";

const mssql = require("./services/mssql");
const app = require("./services/express");

// start app and connect to database
app.start();
mssql.connect();

module.exports = app;
