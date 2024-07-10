const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

async function getConnection() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminuser",
    database: "board",
  });
  return con;
}

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  const { userid, pwd } = req.body;
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM member WHERE userid=?";
    const [rows, fields] = await con.query(sql, [userid]);
    if (rows.length > 0) {
      if (rows[0].pwd === pwd) {
        const uniqInt = Date.now();
        req.session[uniqInt] = rows[0];
        res.cookie("session", uniqInt, { httpOnly: true, path: "/", maxAge: 3600 * 1000});
        return res.send({ msg: "ok" });
      } else {
        return res.send({ msg: "비밀번호가 틀렸습니다" });
      }
    } else {
      return res.send({ msg: "존재하지 않는 아이디입니다" });
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/logout", (req, res) => {
  if (req.cookies.session) {
    delete req.session[req.cookies.session];
    res.clearCookie("session", req.cookies.session, {
      httpOnly: true,
      path: "http://localhost:3000/",
    });
  } else {
    req.session.destroy(); // 세션 쿠키 한번에 삭제
  }
  res.redirect("http://localhost:3000/");
});

router.post("/join", async (req, res) => {
  const { userid, pwd, name, email, phone } = req.body;
  try {
    const con = await getConnection();
    const sql =
      "INSERT INTO member(userid, name, pwd, email, phone) VALUES(?, ?, ?, ?, ?)";
    const [result, field] = await con.query(sql, [
      userid,
      name,
      pwd,
      email,
      phone,
    ]);
    console.log("result 출력 : ", result);
    res.send({ msg: "ok" });
  } catch (error) {
    console.error(error);
  }
});

router.get("/getLoginUser", (req, res) => {
  const loginUser = req.session[req.cookies.session];
  res.send(loginUser);
});

router.post("/updateMember", async (req, res) => {
  const { userid, pwd, name, email, phone } = req.body;
  try {
    const con = await getConnection();
    const sql =
      "UPDATE member SET pwd=?, name=?, email=?, phone=? WHERE userid=?";
    const [result, field] = await con.query(sql, [
      pwd,
      name,
      email,
      phone,
      userid,
    ]);
    req.session[req.cookies.session] = { userid, pwd, name, email, phone };
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
