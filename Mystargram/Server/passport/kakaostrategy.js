// kakaoStrategy.js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const mysql = require('mysql2/promise');

async function getConnection(){
    const connection = await mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'adminuser',
        database : 'mystargram'
    });
    return connection;
}

module.exports=()=>{
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,   
                callbackURL: '/member/kakao/callback',
            },
            async ( accessToken, refreshToken, profile, done )=>{
                // 회원조회를 해서 없으면 회원 가입부터 하고  로그인
                const connection = await getConnection();
                let sql = 'select * from member where snsid=? and provider=?';
                let [rows, fields] = await connection.query(sql, [profile.id, 'kakao']);
                if( rows.length>=1){
                    done(null, rows[0]);
                }else{
                    sql = "insert into member(email, nickname, pwd, snsid, provider) values(?,?,?,?,?)";
                    [result, fields] = await connection.query(sql, [ profile.displayName , profile.displayName, "1111", profile.id , 'kakao']);

                    sql = 'select * from member where snsid=? and provider=?';
                    let [rows2, fields2] = await connection.query(sql, [profile.id, 'kakao']);
                    done(null, rows2[0]);
                }
            }
        )
    )
}