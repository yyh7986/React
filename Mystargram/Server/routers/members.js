const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// DB연결
async function getConnection() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminuser",
    database: "mystargram",
  });
  return con;
}

// 회원가입
router.post("/join", async (req, res) => {
  const { email, pwd, nickname, profilemsg, profileimg, phone } = req.body;
  try {
    const con = await getConnection();
    const sql =
      "INSERT INTO member(nickname, email, pwd, phone, profileimg, profilemsg) VALUES(?, ?, ?, ?, ?, ?)";
    const [result, field] = await con.query(sql, [
      nickname,
      email,
      pwd,
      phone,
      profileimg,
      profilemsg,
    ]);
    console.log("insert result 출력 : ", result);
    res.send({ msg: "ok" });
  } catch (error) {
    console.error(error);
  }
});

// 회원가입_이메일 중복체크
router.get("/emailChk/:email", async (req, res) => {
  const con = await getConnection();
  const sql = "SELECT * FROM member WHERE email=?";
  const [result, field] = await con.query(sql, [req.params.email]);
  console.log("select result 출력 : ", result);
  if (result.length > 0) {
    res.send({ msg: "unavailable" });
  } else {
    res.send({ msg: "available" });
  }
});

// 회원가입_닉네임 중복체크
router.get("/nicknameChk/:nickname", async (req, res) => {
  const con = await getConnection();
  const sql = "SELECT * FROM member WHERE nickname=?";
  const [result, field] = await con.query(sql, [req.params.nickname]);
  if (result.length > 0) {
    res.send({ msg: "unavailable" });
  } else {
    res.send({ msg: "available" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM member WHERE email=?";
    const [result, field] = await con.query(sql, [email]);
    if (!result.length) {
      res.send({ msg: "no id" });
    } else {
      if (result[0].pwd !== pwd) {
        res.send({ msg: "incorrect pwd" });
      } else {
        const uniqInt = Date.now();
        req.session[uniqInt] = result[0];
        res.cookie("session", uniqInt, {
          httpOnly: true,
          path: "/",
          maxAge: 3600 * 1000,
        });
        res.send({ msg: "success" });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
