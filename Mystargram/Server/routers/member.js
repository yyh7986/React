const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');

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
router.post('/fileupload', uploadObj.single('image'), (req, res)=>{
    res.send({ filename : req.file.filename } );
});

router.post('/emailcheck', async (req, res)=>{
    const {email} = req.body;
    try{
        const connection = await getConnection();
        const sql = 'select * from member where email=?';
        const [rows, fields] = await connection.query(sql, [email] );
        if( rows.length >= 1 ){
            res.send({msg:'no'});
        }else{
            res.send({msg:'ok'});
        }
    }catch(err){
        console.error(err)
    }
});

router.post('/nicknamecheck', async (req, res)=>{
    const {nickname} = req.body;
    try{
        const connection = await getConnection();
        const sql = 'select * from member where nickname=?';
        const [rows, fields] = await connection.query(sql, [nickname] );
        if( rows.length >= 1 ){
            res.send({msg:'no'});
        }else{
            res.send({msg:'ok'});
        }
    }catch(err){
        console.error(err)
    }
});

router.post('/join', async (req, res, next)=>{
    const {email, pwd, nickname, phone, intro,  filename } =req.body;
    try{
        const connection = await getConnection();
        const sql = "insert into member(email, pwd, nickname,  phone, profilemsg, profileimg) values(?,?,?,?,?,?)";
        const [result, fields] = await connection.query(sql, [email, pwd, nickname, phone, intro,  filename]);
        res.send({msg:'ok'});
    }catch(err){
        console.error(err)
    }
});



router.post('/loginlocal',  (req, res, next)=>{
    passport.authenticate(
        'local', 
        ( authError, user, info )=>{
            if( authError ){
                // 서버에러가 발생
                console.error(authError);
                return;
            }
            if( !user ){
                // 이메일이 없거나 패스워드가 틀리거나
                console.log(info.message);
                return res.send({msg : info.message} );
            }

            // 정상 로그인  // req.login() : req 가 같고 있는 로그인 관련 함수
            return req.login( user, (loginError)=>{
                if (loginError) {    
                    console.error(loginError);
                    return next(loginError);
                }
                console.log("loginUser : ", req.user);
                return res.send( { msg:'ok', loginUser : req.user } )
            })
        } 
    )(req, res, next);
} );


router.get('/kakao', passport.authenticate('kakao') );

router.get('/kakao/callback', 
    passport.authenticate('kakao',
        { 
            failureRedirect: 'http://localhost:3000/' 
        }  
    ) ,  
    (req, res) => {
        res.redirect('http://localhost:3000/main');
    }
);


router.get('/getLoginUser', async (req, res)=>{
    try {
        const con = await getConnection();

        let sql = "SELECT * FROM follow WHERE ffrom=?";
        let [rows, fields] = await con.query(sql, [req.user.nickname]);
        // ffrom 에서 로그인 유저닉네임을 검색하고 검색결과 fto들을 정리해서 배열로 변환
        let followings = (rows.length>=1) ? rows.map((f)=>(f.fto)):[];

        sql = "SELECT * FROM follow WHERE fto=?";
        [rows, fields] = await con.query(sql, [req.user.nickname]);
        // ffrom 에서 로그인 유저닉네임을 검색하고 검색결과 fto들을 정리해서 배열로 변환
        followers = (rows.length>=1) ? rows.map((f)=>(f.ffrom)):[];

        res.send({loginUser:req.user, followings, followers});

        con.end();
    } catch (err) {
        console.error(err);
    }
});


router.get("/getFollowings", async(req, res)=>{
    try {
        const con = await getConnection();

        let sql = "SELECT * FROM follow WHERE ffrom=?";
        let [rows, fields] = await con.query(sql, [req.user.nickname]);
        let followings = (rows.length>=1) ? rows.map((f)=>(f.fto)):[];
        res.send(followings);
        con.end();
    } catch (error) {
        
    }
})

router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.send("ok");
})

router.post("/follow", async (req, res)=>{
    const {ffrom, fto} = req.body;
    try {
        const con = await getConnection();
        let sql = "INSERT INTO follow(ffrom, fto) VALUES(?,?)";
        let [result, field] = await con.query(sql, [ffrom, fto]);
        res.send("ok");
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;