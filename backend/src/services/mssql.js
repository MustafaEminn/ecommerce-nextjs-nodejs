"use strict";

const config = require("../config");
var sql = require("mssql");

var configSQL = {
  user: "sa",
  password: "12345",
  server: "localhost",
  database: "e-davetiyecim",
  integratedSecurity: "SSPI",
  trustServerCertificate: true,
  name: "default",
  requestTimeout: 300000,
};

exports.connect = () => {
  return sql.connect(configSQL, function (err) {
    if (err) console.log(err);

    // // create Request object
    // var request = new sql.Request();

    // // query to the database and get the records
    // request.query("select * from Student", function (err, recordset) {
    //   if (err) console.log(err);

    //   // send records as a response
    //   res.send(recordset);
    // });
  });
};
