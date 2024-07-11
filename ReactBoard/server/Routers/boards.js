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

let paging = {
  page: 1,
  totalCount: 0,
  beginPage: 0,
  endPage: 0,
  displayRow: 10,
  displayPage: 10,
  prev: false,
  next: false,
  startNum: 0,
  endNum: 0,
  calPaging: function () {
    this.endPage = Math.ceil(this.page / this.displayPage) * this.displayPage;
    this.beginPage = this.endPage - (this.displayPage - 1);
    let totalPage = Math.ceil(this.totalCount / this.displayRow);
    if (totalPage < this.endPage) {
      this.endPage = totalPage;
      this.next = false;
    } else {
      this.next = true;
    }
    this.prev = this.beginPage == 1 ? false : true;
    this.startNum = (this.page - 1) * this.displayRow + 1;
    this.endNum = this.page * this.displayRow;
    console.log(
      this.beginPage +
        " " +
        this.endPage +
        " " +
        this.startNum +
        " " +
        this.endNum +
        " " +
        this.totalCount
    );
  },
};

router.get("/getBoardList/:page", async (req, res, next) => {
  if (req.params.page != undefined) {
    paging.page = req.params.page;
    req.session.page = req.params.page;
  } else if (req.session.page != undefined) {
    paging.page = req.session.page;
  } else {
    req.session.page = "";
  }
  try {
    const con = await getConnection();
    let sql = "SELECT * FROM board";
    let [rows1, fields1] = await con.query(sql);
    paging.totalCount = rows1.length;
    paging.calPaging();

    sql = "SELECT * FROM board ORDER BY num DESC LIMIT ? OFFSET ?";
    const [rows, fields] = await con.query(sql, [
      paging.displayRow,
      paging.startNum - 1,
    ]);
    res.send({ boardList: rows, paging });
  } catch (error) {
    console.error(error);
  }
});

router.get("/getBoard/:num", async (req, res, next) => {
  try {
    const con = await getConnection();
    let sql = "UPDATE board SET readcount=readcount+1 WHERE num=?";
    const [result1, field1] = await con.query(sql, [req.params.num]);

    sql = "SELECT * FROM board WHERE num=?";
    const [result, field] = await con.query(sql, [req.params.num]);
    res.send({ board: result[0] });
  } catch (error) {
    console.error(error);
  }
});

router.get("/getReply/:num", async (req, res, next) => {
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM reply WHERE boardnum=? ORDER BY replynum DESC";
    const [rows, fields] = await con.query(sql, [req.params.num]);
    res.send({ replyList: rows });
  } catch (error) {
    console.error(error);
  }
});

router.post("/addReply", async (req, res, next) => {
  const { num, userid, rContent } = req.body;
  try {
    const con = await getConnection();
    const sql = "INSERT INTO reply(boardnum, userid, content) VALUES(?,?,?)";
    const [result, field] = await con.query(sql, [num, userid, rContent]);
    res.send("success");
  } catch (err) {
    console.error(err);
  }
});

router.delete("/deleteReply/:replyNum", async (req, res, next) => {
  try {
    const con = await getConnection();
    const sql = "DELETE FROM reply WHERE replynum=?";
    const [result, field] = await con.query(sql, [req.params.replyNum]);
    res.send("success");
  } catch (error) {
    console.error(error);
  }
});

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("폴더를 생성함");
  fs.mkdirSync("uploads");
}

const uploadObj = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/fileupload", uploadObj.single("image"), (req, res) => {
  res.send({ savefilename: req.file.filename, image: req.file.originalname });
});

router.post("/insertBoard", async (req, res) => {
  const { userid, email, pass, title, content, image, savefilename } = req.body;
  try {
    const con = await getConnection();
    const sql =
      "INSERT INTO board(userid, email, pass, title, content, image, savefilename) VALUES(?,?,?,?,?,?,?)";
    const [result, field] = await con.query(sql, [
      userid,
      email,
      pass,
      title,
      content,
      image,
      savefilename,
    ]);
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

router.post("/updateBoard", async (req, res) => {
  const { title, content, image, savefilename, num } = req.body;
  try {
    const con = await getConnection();
    const sql =
      "UPDATE board SET title=?, content=?, image=?, savefilename=? WHERE num=?";
    const [result, field] = await con.query(sql, [
      title,
      content,
      image,
      savefilename,
      num,
    ]);
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

router.delete("/deleteBoard/:num", async (req, res) => {
  try {
    const con = await getConnection();
    const sql = "DELETE FROM board WHERE num=?";
    const [result, field] = await con.query(sql, [req.params.num]);
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
