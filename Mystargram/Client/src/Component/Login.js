import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/mystargram.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const memberLogin = (e) => {
    e.preventDefault();
    if (!email) {
      alert("이메일 입력안함");
      return;
    } else if (!pwd) {
      alert("비밀번호 입력안함");
      return;
    }

    axios
      .post("/api/members/login", { email, pwd })
      .then((res) => {
        let resultMsg = res.data.msg;
        console.log(resultMsg);

        if (resultMsg == "no id") {
          alert("존재하지 않는 이메일");
          return;
        } else if (resultMsg == "incorrect pwd") {
          alert("비밀번호 틀림");
          return;
        } else if (resultMsg == "success") {
          alert("로그인 성공");
          navigate("/main");
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const kakaoLogin = () => {
    axios.get("/api/user/kakao");
  };

  return (
    <div className="login">
      <form className="loginform">
        <div className="field">
          <label>이메일</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          ></input>
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.currentTarget.value);
            }}
          ></input>
        </div>
        <div className="btns">
          <button
            onClick={(e) => {
              memberLogin(e);
            }}
          >
            로그인
          </button>
          <button
            onClick={() => {
              navigate("/join");
            }}
          >
            회원가입
          </button>
        </div>
        <div className="snslogin">
          <button
            onClick={() => {
              kakaoLogin();
            }}
          >
            카카오
          </button>
          <button>네이버</button>
          <button>구글</button>
          <button>페이스북</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
