"use strict";
const sql = require("mssql");

exports.updateMember = async (req, res, next) => {
  const body = req.body;
  var request = new sql.Request();

  const updateMember = `UPDATE Users SET 
  Email='${body["Email"]}',
  Name='${body["Name"]}',
  Surname='${body["Surname"]}',
  PhoneNumber='${body["PhoneNumber"]}',
  City='${body["City"]}',
  District='${body["District"]}',
  Neighborhood='${body["Neighborhood"]}',
  Address='${body["Address"]}'
  WHERE id='${body["id"]}'`;

  await request.query(updateMember, (err, record) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Update failed try again." });
    } else {
      res.status(200).send({ code: 2, message: "Updated." });
    }
  });
};

exports.getMembersNewest = async (req, res, next) => {
  var request = new sql.Request();

  const getNewestProductsQuery = `SELECT INTO * FROM Products`;

  await request.query(getNewestProductsQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Products could not got." });
    } else {
      res.status(200).send({ code: 2, message: "Products got." });
    }
  });
};

exports.getMembersTop = async (req, res, next) => {
  var request = new sql.Request();

  const getTopMembersQuery = `SELECT TOP ${req.params.count} * FROM Users ORDER BY createdAt DESC`;

  await request.query(getTopMembersQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Members could not got." });
    } else {
      res
        .status(200)
        .send({ code: 2, message: "Members getted.", members: resBody });
    }
  });
};

exports.getMemberById = async (req, res, next) => {
  var request = new sql.Request();

  const getMemberQuery = `SELECT * FROM Users WHERE id= '${req.params.id}'`;

  await request.query(getMemberQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Member could not got." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Member not found." });
    } else {
      res
        .status(200)
        .send({ code: 3, message: "Member got.", member: resBody });
    }
  });
};

exports.getMemberByEmail = async (req, res, next) => {
  var request = new sql.Request();

  const getMemberQuery = `SELECT * FROM Users WHERE email= '${req.params.email}'`;

  await request.query(getMemberQuery, (err, record) => {
    const resBody = record.recordset;
    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Member could not got." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Member not found." });
    } else {
      res
        .status(200)
        .send({ code: 3, message: "Member got.", member: resBody });
    }
  });
};

exports.getMemberByName = async (req, res, next) => {
  var request = new sql.Request();
  const paramsName = req.params.name.split(" ");
  var name = "";
  var surname = "";
  paramsName.map((item, index) => {
    if (paramsName.length > 1) {
      return index !== paramsName.length - 1
        ? (name += item + " ")
        : (surname += item);
    } else {
      name += item;
      surname += item;
    }
  });

  const getMemberQuery = `SELECT CONCAT(Name, ' ', Surname) AS NameFull,* FROM Users WHERE Name = '${name}' OR Surname = '${surname}'`;

  await request.query(getMemberQuery, (err, record) => {
    console.log(record);
    const resBody = record.recordset;

    if (err) {
      console.log(err);
      res.status(500).send({ code: 1, message: "Member could not got." });
    } else if (!resBody[0]) {
      res.status(500).send({ code: 2, message: "Member not found." });
    } else {
      res
        .status(200)
        .send({ code: 3, message: "Member got.", member: resBody });
    }
  });
};

exports.deleteMember = async (req, res, next) => {
  var request = new sql.Request();
  const deleteMemberQuery = `DELETE FROM Users WHERE id='${req.params.id}'`;

  await request.query(deleteMemberQuery, (err, record) => {
    if (err) {
      res.status(500).send({ code: 1, message: "Member could not deleted." });
    } else {
      res.status(200).send({ code: 2, message: "Member deleted." });
    }
  });
};
