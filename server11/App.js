const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const mysql = require("mysql2/promise");

async function getConnection() {
  let connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminuser",
    database: "board",
  });
  return connection;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});

app.post("/join", async (req, res, next) => {
  const { userid, pwd, name, phone, email } = req.body;
  console.log("받은 내용 : ");
  console.log(userid, pwd, name, phone, email);
  try {
    const con = await getConnection();
    const sql =
      "INSERT INTO member(userid, pwd, name, email, phone) VALUES(?,?,?,?,?)";
    const [result, field] = await con.query(sql, [
      userid,
      pwd,
      name,
      email,
      phone,
    ]);
    res.send("ok");
  } catch (error) {
    next(error);
  }
});

app.post("/getMember", async (req, res, next) => {
  try {
    const con = await getConnection();
    const sql =
      "SELECT * FROM member";
    const [rows, fields] = await con.query(sql);
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`::: ${port}port Server Open :::`);
});
