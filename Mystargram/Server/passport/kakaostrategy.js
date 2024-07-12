const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
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

// 카카오 로그인에 필요한 동작은 익명함수에 기술되고 그 익명함수가 export되며, 이를 passport 폴더에 같이 있는 index.js에서 require 해서 사용할 예정이다

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        // 아래 정보로 사용자 인증 절차가 진행
        clientID: process.env.KAKAO_ID,
        callbackURL: "/user/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const connection = await getConnection();
        // 사용자 인증이 완료되어 사용자 정보가 전달
        // console.log(profile);
        console.log(
          profile._json.kakao_account.email,
          profile.id,
          profile._json.properties.nickname
        );
        try {
          // 토큰으로 받아온 사용자 정보로 조회하고 회원가입
          let sql = "SELECT * FROM member WHERE email=?";
          let [rows, fields] = await connection.query(sql, [
            profile._json.properties.nickname,
          ]); // 이메일로 회원 유무 조회
          // 회원 가입 내역에 따라 회원가입후 또는 바로 done 함수를 실행하여 다음 로그인 절차를 진행
          if (rows.length >= 1) {
            // 바로 done 실행
            done(null, rows[0]);
            // null : 로그인에 에러가 없음을 의미.
          } else {
            // 회원 가입후
            sql =
              "INSERT INTO member(email, snsid, nickname, provider) VALUES(?,?,?,?)";
            [result, fields] = await connection.query(sql, [
              profile._json.properties.nickname,
              profile.id,
              profile._json.properties.nickname,
              "kakao",
            ]);
            // 방금 회원가입한 사용자를 조회
            // 방금 추가한 레코드 다시 검색후 done 실행
            sql = "SELECT * FROM member WHERE email=?";
            [rows, fields] = await connection.query(sql, [
              profile._json.properties.nickname,
            ]);
            done(null, rows[0]);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
