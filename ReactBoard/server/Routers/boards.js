const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

async function getConnection() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminuser",
    database: "board",
  });
  return con;
}

router.get("/getBoardList", async (req, res, next) => {
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM board ORDER BY num DESC";
    const [rows, fields] = await con.query(sql);
    // console.log("rows : ", rows);
    res.send({ boardList: rows });
  } catch (error) {
    console.error(error);
  }
});

router.get("/getBoard/:num", async (req, res, next) => {
  try {
    const con = await getConnection();
    let sql = "SELECT * FROM board WHERE num=?";
    const [result, field] = await con.query(sql, [req.params.num]);
    console.log("result : ", result);

    sql = "SELECT * FROM reply WHERE boardnum=?";
    const [rows, fields] = await con.query(sql, [req.params.num]);
    res.send({ board: result[0], replyList:rows });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
