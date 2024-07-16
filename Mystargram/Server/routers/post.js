const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

async function getConnection(){
  const connection = await mysql.createConnection({
      host : 'localhost',
      user : 'root',
      password : 'adminuser',
      database : 'mystargram'
  });
  return connection;
}

try {
  fs.readdirSync('uploads/');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads/');
}
const uploadObj = multer({
  storage: multer.diskStorage({
      destination(req, file, done) {   done(null, 'uploads/');  },
      filename(req, file, done) {
          const ext = path.extname(file.originalname);
          done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/imgup', uploadObj.single('image'), (req, res)=>{
  res.send({ filename : req.file.filename } );
});

router.post("/writePost", async (req, res)=>{
  const {content, writer} = req.body;
  try {
    const con = await getConnection();

    // post 테이블에 레코드를 추가. id 저장
    let sql = "INSERT INTO post(content, writer) VALUES(?,?)";
    let [result, field] = await con.query(sql, [content, writer])
    const postid = result.insertId;
    console.log("postid : ", postid);
    
    // content에서 해시태그를 분리.
    const hashtags = content.match(/(?<=#)[^\s#]+/g);
    console.log("해시태그들 : ", hashtags);

    // 각 해시태그들을 새로운 태그들만 hashtag 테이블에 저장. id 저장
    if(hashtags){
      hashtags.map(async (tag, idx)=>{
        // 현재 태그가 hashtag 테이블에 존재하는지 조회
        sql = "SELECT * FROM hashtag WHERE word=?";
        [result, field] = await con.query(sql, [tag]);
        let tagid;
        if(result.length>=1){
          tagid = result[0].id;
        }else{
          sql = "INSERT INTO hashtag(word) VALUES(?)";
          [result, field] = await con.query(sql, [tag]);
          tagid = result.insertId;
        }
        console.log("tagid : ", tagid);

        // postid와 hashid로 post_hash테이블에 레코드 추가
        sql = "INSERT INTO post_hash(postid, hashid) VALUES(?,?)";
        [result, field] = await con.query(sql, [postid, tagid]);
      })
    }
    res.send({postid});
  } catch (error) {

    console.error(error);
  }
})

router.post("/writeImages", async (req, res)=>{
  const {postid, filename} = req.body;
  try {
    const con = await getConnection();
    const sql = "INSERT INTO images(postid, savefilename) VALUES(?,?)"; 
    let [result, fields] = await con.query(sql, [postid, filename]);
    res.send("ok");
  } catch (err) {
    console.error(err);
  }
})

let paging = {
  page : 1, // 현재 페이지
  displayRow : 3, // 한 스크롤에 보여줄 피드 갯수
  startNum : 0,
  endNum : 0,
  calPaging : function(){
    this.startNum = (this.page-1) * this.displayRow + 1;
    this.endNum = this.page * this.displayRow;
    console.log("start end", this.startNum + " " + this.endNum);
  }
}

router.get("/getPostList/:page", async (req,res)=>{
  if(req.params.page != undefined){
    paging.page = req.params.page;
  }else{
    paging.page = 1;
  }
  paging.calPaging();
  
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM post ORDER BY id DESC";
    let [rows, fields] = await con.query(sql);
    res.send({postList:rows});
  } catch (error) {
   console.error(error) ;
  }
})

router.get("/getImages/:postid", async(req, res)=>{
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM images WHERE postid=?";
    let [result, fields] = await con.query(sql, [req.params.postid])
    res.send(result);
  } catch (err) {
    console.error(err);
  }
})

router.get("/getLikes/:postid", async(req, res)=>{
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM likes WHERE postid=?";
    let [result, fields] = await con.query(sql, [req.params.postid])
    res.send(result);
  } catch (err) {
    console.error(err);
  }
})

router.post("/addLike", async(req, res)=>{
  const {postid, likenick} = req.body;
  try {
    const con = await getConnection();
    let sql = "SELECT * FROM likes WHERE postid=? AND likenick=?"
    let [rows, field] = await con.query(sql, [postid, likenick]);
    if(rows.length>0){
      sql = "DELETE FROM likes WHERE postid=? AND likenick=?"
      const [result, field] = await con.query(sql, [postid, likenick]);
    }else{
      sql = "INSERT INTO likes(postid, likenick) VALUES(?,?)";
      const [result, field] = await con.query(sql, [postid, likenick]);
    }
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
})

router.get("/getReplys/:postid", async (req, res)=>{
  try {
    const con = await getConnection();
    const sql = "SELECT * FROM reply WHERE postid=? ORDER BY id DESC";
    const [result, fields] = await con.query(sql, [req.params.postid]);
    res.send(result);
  } catch (err) {
    console.error(err);
  }
})

router.post("/addReply", async(req, res)=>{
  const {writer, content, postid} = req.body;
  try {
    const con = await getConnection();
    const sql = "INSERT INTO reply(postid, writer, content) VALUES(?,?,?)";
    const [result, field] = await con.query(sql, [postid, writer, content]);
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
})

router.delete("/deleteReply/:id", async (req, res)=>{
  try {
    const con = await getConnection();
    const sql = "DELETE FROM reply WHERE id=?";
    const [result, field] = await con.query(sql, [req.params.id]);
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
})

module.exports = router;