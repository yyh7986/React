const passport = require("passport");
const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2/promise");

async function getConnection() {
  let connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminuser",
    database: "mystargram",
  });
  return connection;
}

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/main", // 인증 & 회원가입 및 로그인 실패 했을때 이동할 주소
  }),
  (req, res) => {
    const uniqueInt = Date.now();
    req.session[uniqueInt] = req.user;
    res.cookie("session", uniqueInt, { httpOnly: true, path: "/" });
    res.redirect("/main"); // 성공했을때 이동할 주소
  }
);


module.exports = router;